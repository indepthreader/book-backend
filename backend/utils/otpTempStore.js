// Simple in-memory store for OTPs
const otpStore = new Map();
// key: email, value: { otp, userData, expiresAt }

function setOTP(email, userData, otp, ttl = 5 * 60 * 1000) {
  const expiresAt = Date.now() + ttl;
  otpStore.set(email, { otp, userData, expiresAt });
}

function getOTP(email) {
  const record = otpStore.get(email);
  if (!record) return null;

  // Check expiry
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return null;
  }

  return record;
}

function deleteOTP(email) {
  otpStore.delete(email);
}

module.exports = { setOTP, getOTP, deleteOTP };
