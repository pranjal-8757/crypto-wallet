const jwt = require('jsonwebtoken');
const { ApiError } = require('../utils/helpers');

function secret() {
  if (!process.env.VISUAL_PASSWORD_TOKEN_SECRET && !process.env.JWT_SECRET) {
    throw new ApiError(500, 'Verification token service is not configured.');
  }
  return process.env.VISUAL_PASSWORD_TOKEN_SECRET || process.env.JWT_SECRET;
}

function generateVerificationToken({ userId, challengeId }) {
  return jwt.sign({ sub: String(userId), challengeId, type: 'visual-password' }, secret(), {
    expiresIn: process.env.VISUAL_PASSWORD_TOKEN_EXPIRES_IN || '10m',
  });
}

function verifyVerificationToken(token, userId) {
  try {
    const payload = jwt.verify(token, secret());
    if (payload.type !== 'visual-password' || payload.sub !== String(userId)) throw new Error('Invalid token subject');
    return payload;
  } catch {
    throw new ApiError(403, 'A valid Visual Password verification token is required.');
  }
}

function generateRecoveryAuthorizationToken({ userId, recoveryId }) {
  return jwt.sign({ sub: String(userId), recoveryId: String(recoveryId), type: 'recovery' }, secret(), {
    expiresIn: process.env.RECOVERY_AUTH_TOKEN_EXPIRES_IN || '10m',
  });
}

module.exports = { generateVerificationToken, verifyVerificationToken, generateRecoveryAuthorizationToken };
