// backend/app.js
// Single entrypoint: Express app + Mongo + auth routes.

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const session = require('express-session');              // IMPORTANT
const passport = require('./src/config/passport');       // uses src/config/passport.js

const authRoutes = require('./routes/auth'); // USES backend/routes/auth.js

const app = express();

// Basic logging in dev
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Security headers
app.use(helmet());

// Body parsing (ONCE)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: false }));

// Cookies
app.use(cookieParser());

// Session middleware (needed for Passport login sessions)
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'dev-session-secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false, // set true only if you're behind HTTPS
      httpOnly: true,
      sameSite: 'lax',
    },
  })
);

// Passport session support (for Google OAuth)
if (passport) {
  app.use(passport.initialize());
  app.use(passport.session());
}

// Optional: key sanitizer
function sanitizeKeys(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((v) => sanitizeKeys(v));
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (k === '__proto__' || k === 'constructor') continue;
    let safeKey = k;
    if (safeKey.startsWith('$')) safeKey = safeKey.replace(/^\$+/, '_');
    if (safeKey.includes('.')) safeKey = safeKey.replace(/\./g, '_');
    out[safeKey] = sanitizeKeys(v);
  }
  return out;
}

app.use((req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      const cleaned = sanitizeKeys(req.body);
      Object.keys(req.body).forEach((k) => delete req.body[k]);
      Object.assign(req.body, cleaned);
    }
    if (req.params && typeof req.params === 'object') {
      const cleaned = sanitizeKeys(req.params);
      Object.keys(req.params).forEach((k) => delete req.params[k]);
      Object.assign(req.params, cleaned);
    }
    if (req.query && typeof req.query === 'object') {
      req.safeQuery = sanitizeKeys(req.query);
    }
    next();
  } catch (err) {
    console.error('Sanitizer error:', err);
    next();
  }
});

// CORS
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(
  cors({
    origin: FRONTEND_URL,
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// MOUNT ONLY backend/routes/auth.js HERE
app.use('/api/auth', authRoutes);

// Health
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// --- Mongo + server start ---
const PORT = process.env.PORT || 4000;
const MONGO_URI =
  process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rovexa';

mongoose.set('strictQuery', true);

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to start server:', err);
    process.exit(1);
  });

module.exports = app;
