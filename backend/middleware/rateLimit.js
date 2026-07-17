const { ApiError } = require('../utils/helpers');
const buckets = new Map();

function rateLimit({ windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000, max = Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100 } = {}) {
  return (req, res, next) => {
    const key = `${req.ip}:${req.baseUrl}`; const now = Date.now();
    const bucket = (buckets.get(key) || []).filter((time) => now - time < windowMs);
    if (bucket.length >= max) return next(new ApiError(429, 'Too many requests. Please try again later.'));
    bucket.push(now); buckets.set(key, bucket);
    res.set('RateLimit-Limit', String(max)); res.set('RateLimit-Remaining', String(max - bucket.length));
    next();
  };
}
module.exports = rateLimit;
