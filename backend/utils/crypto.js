const crypto = require('crypto');

/**
 * utils/crypto.js
 *
 * Generic, domain-agnostic crypto helpers (random IDs, opaque
 * tokens, hashing). These are NOT part of the Visual Password SDK's
 * verification algorithm and NOT related to blockchain/transaction
 * signing -- just infrastructure primitives used across models and
 * services (e.g. generating a challengeId or a verification token
 * string before it's persisted).
 */

/**
 * Generates a random hex ID of the given byte length.
 * @param {number} bytes
 * @returns {string}
 */
function generateRandomId(bytes = 16) {
  return crypto.randomBytes(bytes).toString('hex');
}

/**
 * Generates a URL-safe opaque token, suitable for one-time-use
 * identifiers (e.g. a verification token record's `token` field).
 * @param {number} bytes
 * @returns {string}
 */
function generateOpaqueToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('base64url');
}

/**
 * One-way SHA-256 hash of a string, hex-encoded.
 * @param {string} value
 * @returns {string}
 */
function sha256(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

module.exports = {
  generateRandomId,
  generateOpaqueToken,
  sha256,
};
