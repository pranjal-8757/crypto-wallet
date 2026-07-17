const logger = require('../utils/logger');

/**
 * Centralized error handler. Every controller/middleware forwards
 * errors here via next(err) (directly, or through asyncHandler).
 *
 * Recognizes:
 *  - ApiError instances (utils/helpers.js) -> use their statusCode
 *  - Mongoose ValidationError -> 400
 *  - Mongoose CastError (bad ObjectId) -> 400
 *  - Duplicate key error (code 11000) -> 409
 *  - Anything else -> 500
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';
  let details = err.details || null;

  if (err.name === 'ValidationError') {
    statusCode = 400;
    details = Object.values(err.errors || {}).map((e) => e.message);
    message = 'Validation failed';
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  } else if (err.code === 11000) {
    statusCode = 409;
    message = 'Duplicate value violates a unique constraint';
    details = err.keyValue || null;
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} -> ${err.stack || err.message}`);
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode} ${message}`);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { details } : {}),
    ...(process.env.NODE_ENV !== 'production' ? { stack: err.stack } : {}),
  });
}

module.exports = errorHandler;
