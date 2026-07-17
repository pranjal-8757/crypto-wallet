/**
 * utils/helpers.js
 *
 * Small, generic helpers reused across controllers/middleware. No
 * business logic lives here -- just plumbing.
 */

/**
 * Wraps an async Express handler so rejected promises are forwarded
 * to next(err) instead of crashing the process, without needing a
 * try/catch in every controller.
 *
 * @param {(req, res, next) => Promise<any>} fn
 */
function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

/**
 * Standard application error with an HTTP status code attached, so
 * the centralized error handler can respond appropriately.
 */
class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }
}

/**
 * Shapes a consistent success response envelope.
 * @param {import('express').Response} res
 * @param {number} statusCode
 * @param {object} data
 */
function sendSuccess(res, statusCode = 200, data = {}) {
  return res.status(statusCode).json({ success: true, ...data });
}

module.exports = {
  asyncHandler,
  ApiError,
  sendSuccess,
};
