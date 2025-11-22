// backend/routes/auth.js
// Robust, defensive auth router – email/password, JWT, OTP-based reset, optional OAuth.

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const User = require('../src/models/User');

// ---------------------------------------------------------------------------
// JWT config (simple in-memory refresh implementation)
// ---------------------------------------------------------------------------
const ACCESS_EXP = '15m';
const REFRESH_EXP = '7d';
const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || 'access-secret-dev';
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'refresh-secret-dev';

// In-memory refresh token store (replace with DB/Redis in production)
const refreshTokenStore = new Set();

// Simple JWT auth middleware for accessToken
// Simple JWT auth middleware for accessToken
function authenticateAccessToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = jwt.verify(token, ACCESS_SECRET);
    // payload = { sub, email }
    req.auth = payload;
    next();
  } catch (err) {
    console.error("authenticateAccessToken error", err.message);
    return res.status(401).json({ error: "Unauthorized" });
  }
}



function signAccessToken(user) {
  return jwt.sign({ sub: user._id, email: user.email }, ACCESS_SECRET, {
    expiresIn: ACCESS_EXP,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id }, REFRESH_SECRET, {
    expiresIn: REFRESH_EXP,
  });
}

// ---------------------------------------------------------------------------
// Mailer (dev-friendly)
// ---------------------------------------------------------------------------
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT ? Number(process.env.EMAIL_PORT) : 587,
  secure: process.env.EMAIL_PORT === '465',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ---------------------------------------------------------------------------
// Optional passport for OAuth
// ---------------------------------------------------------------------------
let passport = null;
try {
  passport = require('../config/passport');
  if (!passport || typeof passport.authenticate !== 'function') {
    console.warn('routes/auth: loaded passport but it does not look configured.');
    passport = null;
  }
} catch (err) {
  console.warn(
    'routes/auth: could not load ../config/passport – continuing without passport for debug.'
  );
  passport = null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
const safeBody = (req) =>
  req && req.body && typeof req.body === 'object' ? req.body : {};
const safeString = (v) => (typeof v === 'string' ? v : '');

function hashOtp(code) {
  return crypto.createHash('sha256').update(String(code)).digest('hex');
}

// OTP cooldown: only throttle sending, NOT expiry
const OTP_COOLDOWN_MS = 60 * 1000; // 1 minute per email
const otpCooldown = new Map();

// ---------------------------------------------------------------------------
// Health
// ---------------------------------------------------------------------------
router.get('/health', (req, res) => res.json({ auth: 'ok' }));

// ---------------------------------------------------------------------------
// Signup
// ---------------------------------------------------------------------------
router.post('/signup', async (req, res) => {
  try {
    const { email = '', password = '' } = safeBody(req);
    if (!email || !password)
      return res
        .status(400)
        .json({ error: 'email and password required' });

    const normalized = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalized });
    if (existing)
      return res.status(409).json({ error: 'user already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ email: normalized, passwordHash });

    return res
      .status(201)
      .json({ id: user._id, email: user.email });
  } catch (err) {
    console.error('signup error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'server error' });
  }
});

// ---------------------------------------------------------------------------
// Login
// ---------------------------------------------------------------------------
router.post('/login', async (req, res) => {
  try {
      console.log('LOGIN RAW BODY =', req.body);
    const { email = '', password = '' } = safeBody(req);
    if (!email || !password)
      return res
        .status(400)
        .json({ error: 'email and password required' });

    const normalized = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalized });
    if (!user)
      return res.status(401).json({ error: 'invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok)
      return res.status(401).json({ error: 'invalid credentials' });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);

    refreshTokenStore.add(refreshToken);

    return res.json({
      accessToken,
      refreshToken,
      tokenType: 'bearer',
      expiresIn: 15 * 60,
    });
  } catch (err) {
    console.error('login error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'server error' });
  }
});

// ---------------------------------------------------------------------------
// Refresh token
// ---------------------------------------------------------------------------
router.post('/refresh', async (req, res) => {
  try {
    const body = safeBody(req);
    const refreshToken = safeString(body.refreshToken);
    if (!refreshToken)
      return res
        .status(400)
        .json({ error: 'refreshToken required in JSON body' });

    if (!refreshTokenStore.has(refreshToken)) {
      return res
        .status(401)
        .json({ error: 'invalid or revoked refresh token' });
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ error: 'invalid refresh token' });
    }

    const user = await User.findById(payload.sub);
    if (!user)
      return res.status(401).json({ error: 'user not found' });

    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (err) {
    console.error('refresh error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'server error' });
  }
});

// ---------------------------------------------------------------------------
// Logout
// ---------------------------------------------------------------------------
router.post('/logout', (req, res) => {
  try {
    const { refreshToken } = safeBody(req);
    if (refreshToken && refreshTokenStore.has(refreshToken)) {
      refreshTokenStore.delete(refreshToken);
    }
    return res.json({ ok: true });
  } catch (err) {
    console.error('logout error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'server error' });
  }
});

// ---------------------------------------------------------------------------
// SEND OTP (for reset password)
// ---------------------------------------------------------------------------
router.post('/send-otp', async (req, res) => {
  try {
    const email = (req.body && String(req.body.email || ''))
      .toLowerCase()
      .trim();
    if (!email)
      return res.status(400).json({ error: 'email required' });

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return res.status(400).json({ error: 'invalid email' });

    const now = Date.now();
    const last = otpCooldown.get(email) || 0;
    if (now - last < OTP_COOLDOWN_MS) {
      // Cooldown: silently succeed to avoid spam
      return res.json({ ok: true });
    }
    otpCooldown.set(email, now);

    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal if user exists
      return res.json({ ok: true });
    }

    // Generate 6-digit numeric code
    const code = Math.floor(100000 + Math.random() * 900000);
    const codeHash = hashOtp(code);

    // Store hash on user – NO expiry logic
    user.otpCodeHash = codeHash;
    await user.save();

const subject = 'Reset your password – ROVEXA Account';
const text = `We received a request to reset your password.

Your one-time code is: ${code}

If you didn’t request this, you can ignore this email.`;

const html = `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset Code</title>
    <style>
      /* Basic email-safe styling */
      body {
        margin: 0;
        padding: 0;
        background-color: #0f172a;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      }
      .wrapper {
        width: 100%;
        background-color: #0f172a;
        padding: 24px 0;
      }
      .card {
        max-width: 520px;
        margin: 0 auto;
        background: linear-gradient(145deg, #020617, #0b1120);
        border-radius: 16px;
        border: 1px solid rgba(148, 163, 184, 0.35);
        box-shadow: 0 20px 45px rgba(15, 23, 42, 0.9);
        padding: 32px 28px 28px;
        color: #e5e7eb;
      }
      .brand {
        font-size: 20px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #38bdf8;
        margin-bottom: 12px;
      }
      .title {
        font-size: 22px;
        font-weight: 600;
        margin: 0 0 8px;
        color: #f9fafb;
      }
      .subtitle {
        font-size: 14px;
        color: #9ca3af;
        margin: 0 0 20px;
        line-height: 1.5;
      }
      .code-box {
        margin: 24px 0 18px;
        padding: 18px 16px;
        border-radius: 12px;
        background: radial-gradient(circle at top left, #1e293b, #020617);
        border: 1px solid rgba(56, 189, 248, 0.35);
        text-align: center;
      }
      .code-label {
        font-size: 12px;
        text-transform: uppercase;
        letter-spacing: 0.16em;
        color: #9ca3af;
        margin-bottom: 6px;
      }
      .code-value {
        font-size: 28px;
        font-weight: 700;
        letter-spacing: 0.4em;
        color: #facc15;
      }
      .info {
        font-size: 12px;
        color: #9ca3af;
        line-height: 1.6;
        margin-bottom: 16px;
      }
      .button {
        display: inline-block;
        margin-top: 8px;
        padding: 10px 18px;
        background: linear-gradient(135deg, #22c55e, #38bdf8);
        color: #0b1120 !important;
        text-decoration: none;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
      }
      .footer {
        margin-top: 16px;
        font-size: 11px;
        color: #6b7280;
      }
      .divider {
        margin: 18px 0;
        border-top: 1px solid rgba(75, 85, 99, 0.6);
      }
    </style>
  </head>
  <body>
    <div class="wrapper">
      <div class="card">
        <div class="brand">ROVEXA</div>
        <h1 class="title">Password reset request</h1>
        <p class="subtitle">
          We received a request to reset the password for your ROVEXA account.
          Use the one-time code below to continue.
        </p>

        <div class="code-box">
          <div class="code-label">Your one-time code</div>
          <div class="code-value">${code}</div>
        </div>

        <p class="info">
          This code is valid for a single use. If you didn’t request a password reset,
          you can safely ignore this email and your password will remain unchanged.
        </p>

        <div class="divider"></div>

        <p class="footer">
          This is an automated message from the ROVEXA security system. Please do not reply.
        </p>
      </div>
    </div>
  </body>
</html>
`;


    try {
      await transporter.sendMail({
        from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
        to: user.email,
        subject,
        text,
        html,
      });
    } catch (sendErr) {
      console.error(
        'send-otp: email send error',
        sendErr && sendErr.message ? sendErr.message : sendErr
      );
      // Still return success to avoid account enumeration
    }

    return res.json({ ok: true });
  } catch (err) {
    console.error('send-otp error', err && err.stack ? err.stack : err);
    return res.status(500).json({ error: 'server error' });
  }
});

// ---------------------------------------------------------------------------
// VERIFY OTP (optional step)
// ---------------------------------------------------------------------------
router.post('/verify-otp', async (req, res) => {
  try {
    const body = safeBody(req);
    const email = String(body.email || '').toLowerCase().trim();
    const code = String(body.code ?? body.otp ?? '').trim();

    if (!email || !code) {
      return res
        .status(400)
        .json({ error: 'email and code required' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otpCodeHash) {
      return res
        .status(400)
        .json({ error: 'invalid or expired code' });
    }

    const codeHash = hashOtp(code);
    if (codeHash !== user.otpCodeHash) {
      return res
        .status(400)
        .json({ error: 'invalid or expired code' });
    }

    // Do NOT clear OTP here if you want to use it in /reset-with-otp as well.
    return res.json({ success: true, message: 'OTP verified' });
  } catch (err) {
    console.error('verify-otp error', err && (err.stack || err));
    return res.status(500).json({ error: 'server error' });
  }
});

// ---------------------------------------------------------------------------
// RESET PASSWORD WITH OTP
// ---------------------------------------------------------------------------
router.post('/reset-with-otp', async (req, res) => {
  try {
    const email = String(req.body?.email || '').toLowerCase().trim();
    const code = String(req.body?.code || req.body?.otp || '').trim();
    const password = String(req.body?.password || '');

    if (!email || !code || !password) {
      return res.status(400).json({
        error: 'email, code and password required',
      });
    }

    const user = await User.findOne({ email });
    if (!user || !user.otpCodeHash) {
      return res
        .status(400)
        .json({ error: 'invalid or expired code' });
    }

    const codeHash = hashOtp(code);
    if (codeHash !== user.otpCodeHash) {
      return res
        .status(400)
        .json({ error: 'invalid or expired code' });
    }

    // 🔴 NEW: prevent reusing the same old password
    const isSamePassword = await bcrypt.compare(password, user.passwordHash || '');
    if (isSamePassword) {
      return res
        .status(400)
        .json({ error: 'New password must be different from the old password' });
    }

    // Set new password
    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(password, salt);

    // Clear OTP so it can’t be reused
    user.otpCodeHash = undefined;
    await user.save();

    return res.json({ ok: true });
  } catch (err) {
    console.error(
      'reset-with-otp error',
      err && err.stack ? err.stack : err
    );
    return res.status(500).json({ error: 'server error' });
  }
});

// ---------------------------------------------------------------------------
// Google OAuth (optional)
// ---------------------------------------------------------------------------
router.get('/oauth/google', (req, res, next) => {
  console.log('[auth] GET /oauth/google hit; passport?', !!passport);
  if (!passport) {
    return res
      .status(200)
      .send('ok: route mounted, passport not configured');
  }
  return passport.authenticate('google', {
    scope: ['profile', 'email'],
  })(req, res, next);
});

router.get(
  '/oauth/google/callback',
  passport
    ? passport.authenticate('google', {
        failureRedirect: '/login',
        session: false,
      })
    : (req, res) => res.redirect('/login'),
  (req, res) => {
    console.log('[auth] /oauth/google/callback hit, req.user =', req.user);

    const user = req.user;
    if (!user) {
      console.error('[auth] Google callback: req.user is missing, redirecting to /login');
      return res.redirect('/login');
    }

    // Create tokens exactly like /login
    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    refreshTokenStore.add(refreshToken);

    const frontendBase = (process.env.FRONTEND_URL || 'http://localhost:3000')
      .replace(/\/$/, '');

    const redirectUrl =
      `${frontendBase}/oauth-success` +
      `?accessToken=${encodeURIComponent(accessToken)}` +
      `&refreshToken=${encodeURIComponent(refreshToken)}`;

    console.log('[auth] Google callback redirecting to:', redirectUrl);
    return res.redirect(redirectUrl);
  }
);
// ---------------------------------------------------------------------------
// /me (for session-based setups; here req.user must be set by middleware)
// ---------------------------------------------------------------------------

// GET /api/auth/me - works with JWT access token
router.get('/me', authenticateAccessToken, async (req, res) => {
  try {
    const user = await User.findById(req.auth.sub).select('_id email name');
    if (!user) return res.status(401).json({ authenticated: false, error: 'User not found' });

    return res.json({
      authenticated: true,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch {
    res.status(500).json({ error: 'server error' });
  }
});




module.exports = router;
