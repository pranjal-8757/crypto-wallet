const crypto = require('crypto');

function generateOtp(length = 6) {
  const upperBound = 10 ** length;
  return String(crypto.randomInt(0, upperBound)).padStart(length, '0');
}

module.exports = { generateOtp };
