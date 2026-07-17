/**
 * Sole abstraction for the independently deployed Visual Password service.
 * Its API contract is not final, so these methods intentionally do not make
 * HTTP requests or manufacture verification results.
 */
const { ApiError } = require('../utils/helpers');
const unavailable = () => { throw new ApiError(503, 'Visual Password integration is pending its finalized API contract.'); };
async function startChallenge() { return unavailable(); }
async function verifyChallenge() { return unavailable(); }
async function startRecovery() { return unavailable(); }
async function verifyRecovery() { return unavailable(); }
module.exports = { startChallenge, verifyChallenge, startRecovery, verifyRecovery };
