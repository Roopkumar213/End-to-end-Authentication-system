// generateOtp.js
// Creates a 6-digit numeric OTP and returns { otp, otpHash, expiresAt }

const crypto = require('crypto');

const OTP_EXP_MIN = parseInt(process.env.OTP_EXPIRE_MINUTES || '5', 10);

function generateOtp() {
  // OTP: 100000–999999
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Hash OTP for storage
  const otpHash = crypto.createHash('sha256').update(otp).digest('hex');

  // Expiry time
  const expiresAt = new Date(Date.now() + OTP_EXP_MIN * 60 * 1000);

  return { otp, otpHash, expiresAt };
}

module.exports = generateOtp;
