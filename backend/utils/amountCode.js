const { hash } = require('./hash');

function generateAmountCode(amount) {
  const numericAmount = String(amount).trim();
  const digits = hash(`amount:${numericAmount}`).replace(/[^0-9]/g, '');
  return digits.slice(0, 5).padEnd(5, '0');
}

module.exports = { generateAmountCode };
