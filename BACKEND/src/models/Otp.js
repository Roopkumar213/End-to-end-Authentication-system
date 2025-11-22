// Otp.js - store hashed OTPs associated with email (or phone in future)
const mongoose = require('mongoose');

const { Schema } = mongoose;

// src/models/Otp.js — adjust expiresAt line
const otpSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  otpHash: { type: String, required: true },
  expiresAt: { type: Date, required: true }, // removed index:true here
  used: { type: Boolean, default: false },
  attempts: { type: Number, default: 0 },
  purpose: { type: String, default: 'login' },
}, {
  timestamps: true,
});

// TTL index (keep this)
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });


module.exports = mongoose.model('Otp', otpSchema);
