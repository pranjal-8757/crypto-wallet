const { ApiError } = require('./helpers');

function requireFields(fields) {
  return (req, res, next) => {
    const missing = fields.filter((field) => req.body?.[field] === undefined || req.body[field] === '');
    if (missing.length) return next(new ApiError(400, `Missing required field${missing.length > 1 ? 's' : ''}: ${missing.join(', ')}`));
    next();
  };
}

function validateEmail(req, res, next) {
  if (!/^\S+@\S+\.\S+$/.test(req.body?.email || '')) return next(new ApiError(400, 'A valid email is required.'));
  next();
}

function validateTransaction(req, res, next) {
  const { recipient, amount, network } = req.body || {};
  if (!/^0x[a-fA-F0-9]{40}$/.test(recipient || '')) return next(new ApiError(400, 'Recipient must be a valid EVM address.'));
  if (!/^\d+(\.\d+)?$/.test(String(amount || '')) || Number(amount) <= 0) return next(new ApiError(400, 'Amount must be greater than zero.'));
  if (typeof network !== 'string' || network.length > 80) return next(new ApiError(400, 'A valid network is required.'));
  next();
}

module.exports = { requireFields, validateEmail, validateTransaction };
