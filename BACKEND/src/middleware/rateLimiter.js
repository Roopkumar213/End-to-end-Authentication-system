// rateLimiter.js
// Provides two rate limiters:
// 1) authLimiter: very strict for login/signup/otp
// 2) defaultLimiter: general use

const rateLimit = require('express-rate-limit');

// General limiter: 200 requests per 15 mins (set in app.js too)
const defaultLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth limiter: avoid brute force & OTP abuse
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 20, // only 20 attempts per 10 minutes
  message: { error: 'Too many attempts. Try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  defaultLimiter,
  authLimiter,
};
