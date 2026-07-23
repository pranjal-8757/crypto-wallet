const crypto = require('crypto');

function hash(value) {
  return crypto.createHash('sha256').update(String(value)).digest('hex');
}

function timingSafeEqual(left, right) {
  const leftBuffer = Buffer.from(String(left));
  const rightBuffer = Buffer.from(String(right));
  return leftBuffer.length === rightBuffer.length && crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

module.exports = { hash, timingSafeEqual };
