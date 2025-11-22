// src/utils/jwt.js
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const Token = require('../models/Token');

const ACCESS_EXPIRES_SECONDS = parseInt(process.env.JWT_ACCESS_EXPIRES_SECONDS || `${60 * 15}`, 10); // 15m
const REFRESH_EXPIRES_SECONDS = parseInt(process.env.JWT_REFRESH_EXPIRES_SECONDS || `${60 * 60 * 24 * 30}`, 10); // 30d

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET;
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;

if (!ACCESS_SECRET || !REFRESH_SECRET) {
  if (process.env.NODE_ENV === 'test') {
    console.warn('WARNING: JWT secrets not set (test mode). Tests should set JWT secrets.');
  } else {
    console.error('FATAL: JWT secrets missing in .env');
    process.exit(1);
  }
}

// Hash helper - deterministic sha256 hex
function hashToken(raw) {
  return crypto.createHash('sha256').update(String(raw)).digest('hex');
}

// Sign access token - payload uses minimal claims
function signAccessToken(user) {
  return jwt.sign(
    { sub: String(user._id), email: user.email },
    ACCESS_SECRET,
    { expiresIn: `${ACCESS_EXPIRES_SECONDS}s` }
  );
}

// Sign refresh token - generate a random raw token id and embed it in the JWT
// Returns: { rawToken, refreshJwt }
function signRefreshToken(userId, opts = {}) {
  // rawToken is the secret identifier we store hashed in DB
  const rawToken = crypto.randomBytes(32).toString('hex'); // 64 hex chars
  const payload = {
    sub: String(userId),
    rawToken,
    // allow passing extra small metadata if needed
    ...(opts.meta ? { meta: opts.meta } : {}),
  };
  const refreshJwt = jwt.sign(payload, REFRESH_SECRET, { expiresIn: `${REFRESH_EXPIRES_SECONDS}s` });
  return { rawToken, refreshJwt };
}

// Verify helpers
function verifyAccessToken(bearerOrToken) {
  if (!bearerOrToken) throw new Error('No access token provided');
  let token = bearerOrToken;
  if (typeof token === 'string' && token.startsWith('Bearer ')) token = token.slice(7);
  return jwt.verify(token, ACCESS_SECRET);
}

function verifyRefreshToken(token) {
  if (!token) throw new Error('No refresh token provided');
  return jwt.verify(token, REFRESH_SECRET);
}

// Store refresh token record in DB (store hashed token for safety).
// Input: { userId, rawToken, refreshExpiresAt (Date), ip }
// Returns saved Token doc.
async function storeRefreshToken({ userId, rawToken, refreshExpiresAt, ip = null }) {
  const tokenHash = hashToken(rawToken);
  const doc = new Token({
    user: userId,
    tokenHash,
    expiresAt: refreshExpiresAt || new Date(Date.now() + REFRESH_EXPIRES_SECONDS * 1000),
    issuedAt: new Date(),
    ip,
  });
  await doc.save();
  return doc;
}

// Convenience: check if hashed token exists and not expired
async function isRefreshTokenValid(rawTokenOrHash) {
  const possibleHash = rawTokenOrHash.length === 64 && /^[0-9a-f]+$/.test(rawTokenOrHash)
    ? rawTokenOrHash
    : hashToken(rawTokenOrHash);

  const doc = await Token.findOne({ tokenHash: possibleHash });
  if (!doc) return false;
  if (doc.expiresAt && doc.expiresAt.getTime() < Date.now()) return false;
  return true;
}

// Revoke token(s) by raw token or by hash or by DB id
async function revokeToken({ rawToken, tokenHash, id }) {
  const q = [];
  if (id) q.push({ _id: id });
  if (rawToken) q.push({ tokenHash: hashToken(rawToken) });
  if (tokenHash) q.push({ tokenHash });
  if (q.length === 0) return null;
  return Token.deleteOne({ $or: q }).exec();
}

module.exports = {
  hashToken,
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  storeRefreshToken,
  isRefreshTokenValid,
  revokeToken,
};
