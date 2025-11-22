// Token.js - store refresh tokens (hashed) for revocation & rotation
const mongoose = require('mongoose');

const { Schema } = mongoose;

const tokenSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  tokenHash: { type: String, required: true }, // hashed refresh token
  type: { type: String, enum: ['refresh'], default: 'refresh' },
  revoked: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true, index: true },
  createdByIp: { type: String },
  revokedAt: { type: Date },
  replacedByToken: { type: Schema.Types.ObjectId, ref: 'Token' },
}, {
  timestamps: true,
});

// Virtual helper to check expiry
tokenSchema.virtual('isExpired').get(function () {
  return Date.now() >= this.expiresAt.getTime();
});

module.exports = mongoose.model('Token', tokenSchema);
