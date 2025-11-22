// authController.js
// Controller implementing: signup, login, sendOtp, verifyOtp, refreshToken, logout, me, oauthCallback
const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwtLib = require('jsonwebtoken');
const User = require('../models/User');
const Otp = require('../models/Otp');
const Token = require('../models/Token');
const router = express.Router();
const generateOtp = require('../utils/generateOtp');
const sendEmail = require('../utils/mailer');

const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  storeRefreshToken,
  isRefreshTokenValid,
  revokeToken,
  hashToken,
} = require('../utils/jwt');

const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:3000';

// Helper: get raw refresh token from cookie or body
function extractRefreshToken(req) {
  // prefer httpOnly cookie named 'refreshToken', fallback to body
  if (req.cookies && req.cookies.refreshToken) return req.cookies.refreshToken;
  if (req.body && req.body.refreshToken) return req.body.refreshToken;
  if (req.headers && req.headers['x-refresh-token']) return req.headers['x-refresh-token'];
  return null;
}

// --- SIGNUP (email + password) ---
exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) return res.status(409).json({ error: 'User with this email already exists' });

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const user = new User({
      name: name || '',
      email: email.toLowerCase(),
      passwordHash,
      provider: 'local',
      isEmailVerified: false,
    });

    await user.save();

    // Issue tokens
    const accessToken = signAccessToken(user);
    const { rawToken, refreshJwt } = signRefreshToken(user._id);

    // compute expiresAt from refreshJwt
    const decoded = jwtLib.decode(refreshJwt);
    const refreshExpiresAt = new Date(decoded.exp * 1000);

    // store hashed refresh token
    const tokenDoc = await storeRefreshToken({
      userId: user._id,
      rawToken,
      refreshExpiresAt,
      ip: req.ip,
    });

    // link token doc id to user
    await user.addRefreshToken(tokenDoc._id);

    // set refresh cookie (httpOnly)
    res.cookie('refreshToken', refreshJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshExpiresAt.getTime() - Date.now(),
    });

    return res.status(201).json({
      message: 'User created',
      user: { id: user._id, email: user.email, name: user.name },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// --- LOGIN (email + password) ---
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ error: 'email and password required' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user || !user.passwordHash) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const accessToken = signAccessToken(user);
    const { rawToken, refreshJwt } = signRefreshToken(user._id);
    const decoded = jwtLib.decode(refreshJwt);
    const refreshExpiresAt = new Date(decoded.exp * 1000);

    const tokenDoc = await storeRefreshToken({
      userId: user._id,
      rawToken,
      refreshExpiresAt,
      ip: req.ip,
    });

    await user.addRefreshToken(tokenDoc._id);

    res.cookie('refreshToken', refreshJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshExpiresAt.getTime() - Date.now(),
    });

    return res.json({
      message: 'Logged in',
      user: { id: user._id, email: user.email, name: user.name },
      accessToken,
    });
  } catch (err) {
    next(err);
  }
};

// --- SEND OTP ---
exports.sendOtp = async (req, res, next) => {
  try {
    const { email, purpose = 'login' } = req.body || {};
    if (!email) return res.status(400).json({ error: 'email required' });

    const normalized = email.toLowerCase();
    const { otp, otpHash, expiresAt } = generateOtp();

    // Upsert OTP doc for this email + purpose
    await Otp.findOneAndUpdate(
      { email: normalized, purpose },
      { otpHash, expiresAt, used: false, attempts: 0 },
      { upsert: true, new: true }
    );

    // Send email
    const subject = purpose === 'signup' ? 'Your signup OTP' : 'Your login OTP';
    const html = `<p>Your OTP is <strong>${otp}</strong>. It expires in ${process.env.OTP_EXPIRE_MINUTES || 5} minutes.</p>`;

    await sendEmail({ to: normalized, subject, html });

    // For dev convenience only (toggle via env). NEVER enable in production.
    if (process.env.NODE_ENV !== 'production' && process.env.SHOW_OTP === 'true') {
      return res.json({ message: 'OTP sent (dev)', otp });
    }

    return res.json({ message: 'OTP sent' });
  } catch (err) {
    next(err);
  }
};

// --- VERIFY OTP ---
router.post('/verify-otp', async (req, res) => {
  try {
    const body = req.body || {};
    const email = String(body.email || '').toLowerCase().trim();
    const code = String(body.otp ?? body.code ?? '').trim();

    if (!email || !code) {
      return res
        .status(400)
        .json({ success: false, error: 'email and code required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, error: 'invalid or expired code' });
    }

    // NO expiry logic anymore – only check hash exists
    if (!user.otpCodeHash) {
      return res
        .status(400)
        .json({ success: false, error: 'invalid or expired code' });
    }

    const codeHash = crypto
      .createHash('sha256')
      .update(String(code))
      .digest('hex');

    if (codeHash !== user.otpCodeHash) {
      return res
        .status(400)
        .json({ success: false, error: 'invalid or expired code' });
    }

    // Invalidate OTP after success (one-time use)
    user.otpCodeHash = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.json({ success: true, message: 'OTP verified' });
  } catch (err) {
    console.error('verify-otp error', err && (err.stack || err));
    return res
      .status(500)
      .json({ success: false, error: 'server error' });
  }
});

// --- REFRESH TOKEN ---
// refreshToken handler
// --- REFRESH TOKEN ---
// --- REFRESH TOKEN ---
exports.refreshToken = async (req, res, next) => {
  try {
    const refreshJwt = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!refreshJwt) {
      return res.status(401).json({ error: 'No refresh token' });
    }

    // First verify the JWT so we can extract the embedded raw token identifier (if present)
    let payload;
    try {
      payload = jwtLib.verify(refreshJwt, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      // JWT invalid or expired
      await Token.deleteOne({ $or: [{ token: refreshJwt }, { tokenHash: hashToken(refreshJwt) }] }).catch(() => {});
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      return res.status(401).json({ error: 'Invalid or expired refresh token' });
    }

    // Extract candidate raw token identifier from payload (try several common names)
    const rawCandidates = [
      payload.rawToken,
      payload.raw,
      payload.token,
      payload.rt,
      payload.r,
      payload.jti,
    ].filter(Boolean);

    // Build lookup candidates
    const lookupCandidates = [];
    if (rawCandidates.length > 0) {
      for (const c of rawCandidates) {
        lookupCandidates.push({ token: c }, { tokenHash: hashToken(c) });
      }
    } else {
      lookupCandidates.push({ token: refreshJwt }, { tokenHash: hashToken(refreshJwt) });
    }

    // Find the stored token record
    let stored = null;
    for (const q of lookupCandidates) {
      stored = await Token.findOne(q);
      if (stored) break;
    }

    if (!stored) {
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      return res.status(401).json({ error: 'Invalid refresh token' });
    }

    // Load user
    const user = await User.findById(payload.sub);
    if (!user) {
      await Token.deleteOne({ _id: stored._id }).catch(() => {});
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
      });
      return res.status(401).json({ error: 'User not found' });
    }

    // Issue new access token (do not rotate refresh token here unless you implement rotation)
    const accessToken = signAccessToken(user);

    // Re-set the refresh cookie so the response includes Set-Cookie (tests expect this)
    const expiresMs = payload && payload.exp ? Math.max(0, payload.exp * 1000 - Date.now()) : undefined;
    res.cookie('refreshToken', refreshJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      ...(typeof expiresMs === 'number' ? { maxAge: expiresMs } : {}),
    });

    return res.json({ accessToken, user: { id: user._id, email: user.email, name: user.name } });
  } catch (err) {
    // unexpected error
    console.error('refreshToken error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


// --- LOGOUT ---
// logout handler
exports.logout = async (req, res) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (refreshToken) {
  await Token.deleteOne({ $or: [{ token: refreshToken }, { tokenHash: hashToken(refreshToken) }] }).catch(() => {});
}


    // Clear the cookie on client
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/', // ensure path matches where it's set
    });

    return res.json({ message: 'Logged out' });
  } catch (err) {
    console.error('logout error', err);
    return res.status(500).json({ error: 'Server error' });
  }
};


// --- GET /me ---
exports.me = async (req, res, next) => {
  try {
    // requireAuth middleware should set req.user
    const user = req.user;
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    return res.json({
      id: user._id,
      email: user.email,
      name: user.name,
      provider: user.provider,
      avatar: user.avatar,
      createdAt: user.createdAt,
    });
  } catch (err) {
    next(err);
  }
};

// --- OAUTH CALLBACK (after passport) ---
// passport will attach user to req.user
exports.oauthCallback = async (req, res, next) => {
  try {
    const oauthUser = req.user;
    if (!oauthUser) return res.status(400).json({ error: 'OAuth user not found' });

    // Issue tokens
    const accessToken = signAccessToken(oauthUser);
    const { rawToken, refreshJwt } = signRefreshToken(oauthUser._id);
    const decoded = jwtLib.decode(refreshJwt);
    const refreshExpiresAt = new Date(decoded.exp * 1000);

    const tokenDoc = await storeRefreshToken({
      userId: oauthUser._id,
      rawToken,
      refreshExpiresAt,
      ip: req.ip,
    });

    await oauthUser.addRefreshToken(tokenDoc._id);

    // set httpOnly refresh cookie
    res.cookie('refreshToken', refreshJwt, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: refreshExpiresAt.getTime() - Date.now(),
    });

    // Redirect to frontend with access token in query (for demo/dev). In production consider a safer flow.
    const redirectUrl = `${FRONTEND_URL.replace(/\/$/, '')}/auth/oauth-success?accessToken=${accessToken}`;
    return res.redirect(redirectUrl);
  } catch (err) {
    next(err);
  }
};
