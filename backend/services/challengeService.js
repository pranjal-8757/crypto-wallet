const crypto = require('crypto');
const Challenge = require('../models/Challenge');
const { ApiError } = require('../utils/helpers');
const { generateRegisterPositions } = require('../utils/registerGenerator');
const { extractRecipientCode } = require('../utils/recipientCode');

const CHALLENGE_TTL_MS = 5 * 60 * 1000;

function expectedDigits(offset, challengeNumber) {
  return String(offset + challengeNumber).padStart(2, '0');
}

async function createChallenge(user, transaction = {}) {
  if (!user.visualPassword || !user.secretWordMask || !Number.isInteger(user.secretOffset) || !Array.isArray(user.positionKeys)) {
    throw new ApiError(409, 'Visual Password has not been configured for this account.');
  }
  const challengeNumber = crypto.randomInt(0, 100 - user.secretOffset);
  const challenge = await Challenge.create({
    challengeId: crypto.randomUUID(),
    userId: user._id,
    maskedWord: user.secretWordMask,
    challengeNumber,
    expectedDigits: expectedDigits(user.secretOffset, challengeNumber),
    amount: String(transaction.amount || ''),
    recipientCode: extractRecipientCode(transaction.recipient),
    expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS),
  });
  return {
    maskedWord: challenge.maskedWord,
    challengeValue: challenge.challengeNumber,
    challengeId: challenge.challengeId,
    registerPositions: generateRegisterPositions(user.positionKeys),
    expiresAt: challenge.expiresAt,
  };
}

async function getUsableChallenge({ challengeId, userId }) {
  const challenge = await Challenge.findOne({ challengeId, userId }).select('+expectedDigits +recipientCode');
  if (!challenge) throw new ApiError(404, 'Challenge not found.');
  if (challenge.used) throw new ApiError(409, 'This challenge has already been used.');
  if (challenge.expiresAt <= new Date()) throw new ApiError(410, 'This challenge has expired.');
  return challenge;
}

module.exports = { createChallenge, getUsableChallenge };
