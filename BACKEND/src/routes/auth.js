// routes/auth.js
// Defines auth-related routes and wires them to the controller.
// Routes:
//  POST /signup        -> create local user (email/password)
//  POST /login         -> login with email/password
//  POST /send-otp      -> send OTP to email
//  POST /verify-otp    -> verify OTP (login or signup flow)
//  POST /refresh       -> rotate/issue new access token using refresh token
//  POST /logout        -> revoke refresh token / logout
//  GET  /me            -> get current user (protected)
//  GET  /google        -> initiate Google OAuth
//  GET  /google/callback -> OAuth callback
//  GET  /github        -> initiate GitHub OAuth
//  GET  /github/callback -> OAuth callback

const express = require('express');
const passport = require('../config/passport'); // ensures strategies are registered
const router = express.Router();
const User = require('../models/User');

const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

// Apply stricter rate limits to sensitive endpoints
const authRateLimiter = rateLimiter.authLimiter || rateLimiter.defaultLimiter;

// Local auth routes
router.post('/signup', authRateLimiter, authController.signup);
router.post('/login', authRateLimiter, authController.login);

// OTP routes
router.post('/send-otp', authRateLimiter, authController.sendOtp);
router.post('/verify-otp', authRateLimiter, authController.verifyOtp);

// Token routes
router.post('/refresh', rateLimiter.defaultLimiter, authController.refreshToken);
router.post('/logout', rateLimiter.defaultLimiter, authController.logout);

// Protected user info
router.get('/me', requireAuth, authController.me);

// OAuth routes (uses passport; session=false because we use JWTs)
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get(
  '/google/callback',
  passport.authenticate('google', { session: false, failureRedirect: '/auth/oauth-failure' }),
  authController.oauthCallback // controller will issue tokens / redirect to frontend
);

router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get(
  '/github/callback',
  passport.authenticate('github', { session: false, failureRedirect: '/auth/oauth-failure' }),
  authController.oauthCallback
);

// Optional: generic failure redirect for OAuth
router.get('/oauth-failure', (req, res) => {
  res.status(400).json({ error: 'OAuth authentication failed' });
});

module.exports = router;
