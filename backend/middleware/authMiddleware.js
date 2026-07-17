const { verifyAccessToken } = require('../config/jwt');
const { ApiError, asyncHandler } = require('../utils/helpers');

/**
 * middleware/authMiddleware.js
 *
 * Verifies the backend's own access token (issued after the client
 * completes Turnkey passkey authentication) on protected routes. This
 * does NOT perform passkey/WebAuthn verification itself -- that
 * happens on the client against Turnkey. This middleware only guards
 * this backend's endpoints once a session already exists.
 */
const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    throw new ApiError(401, 'Not authenticated. Missing access token.');
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, email: decoded.email };
    next();
  } catch (err) {
    throw new ApiError(401, 'Invalid or expired access token.');
  }
});

module.exports = { protect };
