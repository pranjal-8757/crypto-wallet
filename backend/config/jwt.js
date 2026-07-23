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
  accessExpiresIn: process.env.JWT_EXPIRES_IN || '24h',
  refreshSecret: process.env.JWT_REFRESH_SECRET,
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  refreshCookieName: process.env.JWT_COOKIE_NAME || 'vault_refresh_token',
};

/**
 * Signs a short-lived access token for an authenticated user.
 * @param {{ sub: string, email?: string }} payload
 * @returns {string}
 */
function requireSecret(secret, name) {
  if (!secret) throw new Error(`${name} must be configured.`);
  return secret;
}

function signAccessToken(payload) {
  return jwt.sign(payload, requireSecret(jwtConfig.accessSecret, 'JWT_SECRET'), {
    expiresIn: jwtConfig.accessExpiresIn,
  });
}

/**
 * Verifies an access token, throwing if invalid/expired.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyAccessToken(token) {
  return jwt.verify(token, requireSecret(jwtConfig.accessSecret, 'JWT_SECRET'));
}

/**
 * Signs a longer-lived refresh token, typically stored in an
 * httpOnly cookie.
 * @param {{ sub: string }} payload
 * @returns {string}
 */
function signRefreshToken(payload) {
  return jwt.sign(payload, requireSecret(jwtConfig.refreshSecret, 'JWT_REFRESH_SECRET'), {
    expiresIn: jwtConfig.refreshExpiresIn,
  });
}

/**
 * Verifies a refresh token, throwing if invalid/expired.
 * @param {string} token
 * @returns {object} decoded payload
 */
function verifyRefreshToken(token) {
  return jwt.verify(token, requireSecret(jwtConfig.refreshSecret, 'JWT_REFRESH_SECRET'));
}

module.exports = {
  jwtConfig,
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
