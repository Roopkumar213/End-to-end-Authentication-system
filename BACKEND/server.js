// server.js — final corrected version
require('dotenv').config();
const http = require('http');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const session = require('express-session');
const express = require('express'); // <-- added
// NOTE: do not change anything else unless you intentionally intend to
const FRONTEND_ORIGIN = process.env.FRONTEND_URL || 'http://localhost:3000';
const PORT = process.env.PORT || 4000;

function tryRequire(paths) {
  for (const p of paths) {
    try {
      const resolved = require.resolve(p);
      return require(resolved);
    } catch (err) {
      // ignore and continue
    }
  }
  return null;
}

// === Load Express app (instance or factory) ===
let appModule = tryRequire([
  path.join(__dirname, 'app'),
  path.join(__dirname, 'src', 'app'),
  path.join(__dirname, 'config', 'app'),
  path.join(__dirname, 'src', 'config', 'app'),
]);

if (!appModule) {
  console.error('Failed to locate Express app. Expected one of: ./app, ./src/app, ./config/app, ./src/config/app');
  process.exit(1);
}

const isExpressApp = (x) => !!x && typeof x.use === 'function' && (typeof x.listen === 'function' || !!x._router);
const attempt = (fn) => { try { return fn(); } catch (e) { return e; } };

let app;
if (isExpressApp(appModule)) {
  app = appModule;
} else if (typeof appModule === 'function') {
  let result = attempt(() => appModule());
  if (isExpressApp(result)) {
    app = result;
  } else {
    result = attempt(() => appModule(require('express')));
    if (isExpressApp(result)) {
      app = result;
    } else {
      result = attempt(() => appModule({}));
      if (isExpressApp(result)) {
        app = result;
      } else {
        console.error('Unable to obtain Express app from module. Debug info:');
        console.error('appModule type:', typeof appModule);
        console.error('Result of appModule():', result instanceof Error ? result.stack : result);
        console.error('Result of appModule(require("express")):', result instanceof Error ? result.stack : result);
        console.error('Result of appModule({}):', result instanceof Error ? result.stack : result);
        process.exit(1);
      }
    }
  }
} else {
  console.error('app module is neither an Express instance nor a factory function. Type:', typeof appModule);
  process.exit(1);
}

// --- Place body parsers and JSON error handler BEFORE any route mounting ---
// capture raw body to help debug bad payloads
app.use(express.json({
  verify: (req, res, buf) => {
    try {
      req.rawBody = buf && buf.toString ? buf.toString('utf8') : '';
    } catch (err) {
      req.rawBody = '';
    }
  },
  limit: '200kb'
}));

// keep urlencoded if you receive form posts
app.use(express.urlencoded({ extended: true }));

// error handler for JSON syntax errors (must come after body parser)
app.use((err, req, res, next) => {
  if ((err && err.type === 'entity.parse.failed') || (err instanceof SyntaxError && err.status === 400 && 'body' in err)) {
    console.error('Invalid JSON payload received for', req.path);
    console.error('Raw body:', req.rawBody);
    return res.status(400).json({ error: 'Invalid JSON payload' });
  }
  next(err);
});

// === DB connector ===
const connectDB = tryRequire([
  path.join(__dirname, 'src', 'config', 'db'),
  path.join(__dirname, 'config', 'db'),
  path.join(__dirname, 'src', 'db'),
  path.join(__dirname, 'db'),
]);

if (!connectDB) {
  console.error('Failed to locate DB connector. Expected one of: ./src/config/db, ./config/db, ./src/db, ./db');
  process.exit(1);
}

// === Passport & auth router (optional) ===
const passportModule = tryRequire([
  path.join(__dirname, 'config', 'passport'),
  path.join(__dirname, 'src', 'config', 'passport'),
  path.join(__dirname, 'src', 'passport', 'google'),
]);

const authRouter = tryRequire([
  path.join(__dirname, 'routes', 'auth'),
  path.join(__dirname, 'src', 'routes', 'auth'),
]);

// === Middlewares ===
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}));

// initialize passport (use core passport if configured passport doesn't export instance)
try {
  const corePassport = tryRequire(['passport']) || require('passport');
  if (corePassport) {
    app.use(corePassport.initialize());
    app.use(corePassport.session());
  }
} catch (e) {
  // continue without crash if passport unavailable
  console.warn('Passport core not available; skipping passport.initialize()', e && e.message);
}

// If your config/passport exports initialized instance or strategies, call it if needed (no double-init)
if (passportModule && typeof passportModule === 'function') {
  try {
    // some projects export a function to register strategies; call it with passport if available
    const corePassport = tryRequire(['passport']) || require('passport');
    passportModule(corePassport);
  } catch (e) {
    // ignore if calling fails; don't crash server
  }
} else if (passportModule && passportModule.initialize && passportModule.session) {
  // tag that a configured passport-like object exists; we already initialized core passport above
  // nothing else required
}

// === Mount auth router if present at /api/auth ===
if (authRouter && typeof authRouter === 'function') {
  app.use('/api/auth', authRouter);
} else if (authRouter) {
  try {
    if (authRouter.router) app.use('/api/auth', authRouter.router);
    else app.use('/api/auth', authRouter);
  } catch (e) {
    console.warn('Could not mount authRouter:', e && e.message);
  }
} else {
  console.warn('Auth router not found at ./routes/auth (optional).');
}

console.log('Loaded app successfully. isExpressApp=', isExpressApp(app));

// -- DEBUG: global request logger + guaranteed debug endpoints --
app.use((req, res, next) => {
  console.log('>>> REQ', req.method, req.path, 'cookies=', req.headers.cookie || '(no-cookie)');
  next();
});

// quick explicit debug routes (bypass passport) to prove route wiring
app.get('/__debug/oauth/google', (req, res) => {
  console.log('DEBUG ROUTE HIT: /__debug/oauth/google');
  return res.status(200).send('debug-ok');
});
app.get('/__debug/routes', (req, res) => {
  try {
    const list = [];
    if (app && app._router && Array.isArray(app._router.stack)) {
      app._router.stack.forEach((layer) => {
        if (layer.route && layer.route.path) {
          list.push({ path: layer.route.path, methods: Object.keys(layer.route.methods) });
        } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
          layer.handle.stack.forEach((l) => {
            if (l.route && l.route.path) {
              list.push({ path: l.route.path, methods: Object.keys(l.route.methods) });
            }
          });
        }
      });
    }
    res.json(list);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
});

// === Ensure direct OAuth endpoints exist at expected paths ===
const configuredPassport = (function() {
  try { return require('./config/passport'); } catch (e) { try { return require('./src/config/passport'); } catch (e2) { return null; } }
})();

if (configuredPassport && typeof configuredPassport.authenticate === 'function') {
  // Register direct endpoints matching frontend expectations
  app.get('/api/auth/oauth/google',
    configuredPassport.authenticate('google', { scope: ['profile', 'email'] })
  );

  app.get('/api/auth/oauth/google/callback',
    configuredPassport.authenticate('google', { failureRedirect: `${FRONTEND_ORIGIN}/login` }),
    (req, res) => {
      res.redirect(`${FRONTEND_ORIGIN}/`);
    }
  );

  console.log('Direct OAuth routes registered: /api/auth/oauth/google');
} else {
  app.get('/api/auth/oauth/google', (req, res) => res.status(200).send('ok: oauth route (no passport)'));
  app.get('/api/auth/oauth/google/callback', (req, res) => res.status(200).send('ok: oauth callback (no passport)'));
  console.warn('Configured passport not found — OAuth routes are debug-only. Create backend/config/passport.js to enable Google OAuth.');
}

// === Helpful debug: list registered routes (temporary) ===
if (app && app._router && Array.isArray(app._router.stack)) {
  console.log('--- Registered routes (some) ---');
  app._router.stack.forEach((layer) => {
    if (layer.route && layer.route.path) {
      const methods = Object.keys(layer.route.methods).join(',').toUpperCase();
      console.log(methods.padEnd(8), layer.route.path);
    } else if (layer.name === 'router' && layer.handle && layer.handle.stack) {
      layer.handle.stack.forEach((l) => {
        if (l.route && l.route.path) {
          const methods2 = Object.keys(l.route.methods).join(',').toUpperCase();
          console.log(methods2.padEnd(8), (layer.regexp && layer.regexp.source) || '', l.route.path);
        }
      });
    }
  });
  console.log('-------------------------------');
}

// === start/stop logic ===
let server;

async function start() {
  try {
    // connectDB may export a function or an object with connect()
    if (typeof connectDB === 'function') {
      await connectDB();
    } else if (connectDB && typeof connectDB.connect === 'function') {
      await connectDB.connect();
    } else {
      throw new Error('DB connector found but has no callable connect function.');
    }
    console.log('MongoDB connected');

    server = http.createServer(app);

    server.listen(PORT, () => {
      console.log(`Server listening on port ${PORT} (env=${process.env.NODE_ENV || 'development'})`);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err);
    });

    const shutdown = async (signal) => {
      console.log(`Received ${signal}. Shutting down gracefully...`);
      try {
        if (server) {
          server.close(async () => {
            console.log('HTTP server closed.');
            try {
              await mongoose.disconnect();
              console.log('MongoDB connection disconnected.');
            } catch (err) {
              console.error('Error closing MongoDB connection:', err);
            }
            process.exit(0);
          });
        } else {
          await mongoose.disconnect();
          console.log('MongoDB connection disconnected.');
          process.exit(0);
        }

        setTimeout(() => {
          console.error('Forcing shutdown.');
          process.exit(1);
        }, 10000).unref();
      } catch (err) {
        console.error('Error during shutdown:', err);
        process.exit(1);
      }
    };

    process.on('SIGINT', () => shutdown('SIGINT'));
    process.on('SIGTERM', () => shutdown('SIGTERM'));

  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

module.exports = server;
