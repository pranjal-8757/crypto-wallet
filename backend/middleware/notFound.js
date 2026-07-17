const { ApiError } = require('../utils/helpers');

/**
 * Catches any request that didn't match a registered route and turns
 * it into a 404 ApiError for the centralized error handler.
 */
function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

module.exports = notFound;
