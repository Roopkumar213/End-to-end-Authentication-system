// auth.js
// Middleware to validate access token and attach user to req.user

const User = require('../models/User');
const { verifyAccessToken } = require('../utils/jwt');

exports.requireAuth = async (req, res, next) => {
  try {
    // Access token expected in Authorization: Bearer <token>
    const header = req.headers.authorization || '';
    const [, token] = header.split(' ');

    if (!token) {
      return res.status(401).json({ error: 'Missing access token' });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return res.status(401).json({ error: 'Invalid or expired access token' });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // attach sanitized user
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};
