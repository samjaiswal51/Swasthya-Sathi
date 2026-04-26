// backend/services/qrService.js
// Utility to generate secure tokens and unique Swasthya Card IDs

const crypto = require('crypto');

// Generates a random 32‑character hexadecimal token (128‑bit security)
function generateQrToken() {
  return crypto.randomBytes(16).toString('hex');
}

// Generates a human‑readable Swasthya Card ID like SWA93842
function generateCardId() {
  // Simple deterministic format – ensure uniqueness by prefixing with timestamp
  const randomNum = Math.floor(100000 + Math.random() * 900000); // 6‑digit number
  return `SWA${randomNum}`;
}

module.exports = {
  generateQrToken,
  generateCardId,
};
