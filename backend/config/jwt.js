const jwt = require('jsonwebtoken');

/**
 * config/jwt.js
 *
 * Centralizes JWT configuration and signing/verification for the
 * backend's own session tokens (issued after Turnkey passkey auth
 * succeeds on the client). This does NOT implement passkey/WebAuthn
 * verification -- it only manages the backend's session token once
 * a user is already authenticated.
 */

const jwtConfig = {
  accessSecret: process.env.JWT_SECRET,
  accessExpiresIn: process.env.JWT_EXPIRES_IN || '15m',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  refreshCookieName: process.env.JWT_COOKIE_NAME || 'vault_refresh_token',
};

/**
 * Signs a short-lived access token for an authenticated user.
 * @param {{ sub: string, email?: string }} payload
 * @returns {string}
 */
function signAccessToken(payload) {
  return jwt.sign(payload, jwtConfig.accessSecret, {
    expiresIn: jwtConfig.accessExpiresIn,
  });
}

/**
 * Verifies an access token, throwing if invalid/expired.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyAccessToken(token) {
  return jwt.verify(token, jwtConfig.accessSecret);
}

/**
 * Signs a longer-lived refresh token, typically stored in an
 * httpOnly cookie.
 * @param {{ sub: string }} payload
 * @returns {string}
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, jwtConfig.refreshSecret, {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
}

/**
 * Verifies a refresh token, throwing if invalid/expired.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, jwtConfig.refreshSecret);
}

module.exports = {
  jwtConfig,
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
