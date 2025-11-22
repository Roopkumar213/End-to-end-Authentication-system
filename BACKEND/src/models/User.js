// backend/models/User.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
      unique: true,
    },
    passwordHash: { type: String }, // local users only

    // OAuth
    provider: {
      type: String,
      enum: ['local', 'google', 'github'],
      default: 'local',
    },
    providerId: { type: String, index: true, sparse: true },
    avatar: { type: String },
    isEmailVerified: { type: Boolean, default: false },

    // Password reset token (if you ever use token-link flow)
    resetPasswordToken: String,
    resetPasswordExpires: Date,

    // OTP fields for reset-with-otp flow
    otpCodeHash: { type: String },
    otpExpires: { type: Date },

    // Refresh tokens (for the other authController if you use it)
    refreshTokens: [{ type: Schema.Types.ObjectId, ref: 'Token' }],
  },
  {
    timestamps: true,
  }
);

userSchema.methods.addRefreshToken = function (tokenDocId) {
  if (!this.refreshTokens) this.refreshTokens = [];
  this.refreshTokens.push(tokenDocId);
  return this.save();
};

userSchema.methods.removeRefreshToken = function (tokenDocId) {
  this.refreshTokens = (this.refreshTokens || []).filter(
    (id) => id.toString() !== tokenDocId.toString()
  );
  return this.save();
};

userSchema.methods.clearRefreshTokens = function () {
  this.refreshTokens = [];
  return this.save();
};

module.exports = mongoose.model('User', userSchema);
