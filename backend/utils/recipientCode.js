function extractRecipientCode(recipient) {
  const value = String(recipient || '').trim();
  return value.slice(-2).toUpperCase();
}

module.exports = { extractRecipientCode };
