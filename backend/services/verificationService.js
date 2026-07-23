const { ApiError } = require('../utils/helpers');
const { timingSafeEqual } = require('../utils/hash');
const { validateRegisterDigits } = require('../utils/registerGenerator');
const { generateAmountCode } = require('../utils/amountCode');
const { extractRecipientCode } = require('../utils/recipientCode');
const { getUsableChallenge } = require('./challengeService');
const { generateVerificationToken, verifyVerificationToken } = require('./tokenService');
const User = require('../models/User');

async function startChallenge({ transaction, userId }) {
  const user = await User.findById(userId || transaction?.userId);
  if (!user) throw new ApiError(404, 'User not found.');
  return require('./challengeService').createChallenge(user, transaction);
}

async function verifyChallenge({ user, transaction, userId, challengeId, visualPasswordRegister, amount, recipientRegister }) {
  const challengeUser = user || await User.findById(userId || transaction?.userId);
  if (!challengeUser) throw new ApiError(404, 'User not found.');
  const challenge = await getUsableChallenge({ challengeId, userId: challengeUser._id });
  const visualPasswordValid = validateRegisterDigits(visualPasswordRegister, challengeUser.positionKeys, challenge.expectedDigits);
  const amountValid = timingSafeEqual(String(amount || ''), challenge.amount);
  const recipientValid = challengeUser.positionKeys.every(
    (key, index) => String(recipientRegister?.[key] || '').toUpperCase() === challenge.recipientCode[index]
  );
  // Consume a submitted challenge regardless of outcome to prevent replay/brute force attempts.
  challenge.used = true;
  challenge.usedAt = new Date();
  await challenge.save();
  console.log({
    visualPasswordValid,
    amountValid,
    recipientValid,
    expectedDigits: challenge.expectedDigits,
    expectedAmount: challenge.amount,
    expectedRecipient: challenge.recipientCode,
    receivedAmount: amount,
    receivedRecipient: recipientRegister,
    receivedVisualPassword: visualPasswordRegister
});

if (!visualPasswordValid || !amountValid || !recipientValid) {
    return {
        verified: false,
        visualPasswordValid,
        amountValid,
        recipientValid
    };
}
  return {
    verified: true,
    verificationToken: generateVerificationToken({ userId: challengeUser._id, challengeId: challenge.challengeId }),
  };
}

function verifyAmount({ transaction, amountCode }) {
  const expected = generateAmountCode(transaction.amount);
  if (!timingSafeEqual(String(amountCode || ''), expected)) throw new ApiError(403, 'Amount verification failed.');
  return true;
}

function verifyRecipient({ transaction, recipientCode }) {
  const expected = extractRecipientCode(transaction.recipient);
  if (!timingSafeEqual(String(recipientCode || '').toUpperCase(), expected)) throw new ApiError(403, 'Recipient verification failed.');
  return true;
}

module.exports = { startChallenge, verifyChallenge, verifyAmount, verifyRecipient, generateVerificationToken, verifyVerificationToken };
