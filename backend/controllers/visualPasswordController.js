const { ApiError, asyncHandler, sendSuccess } = require('../utils/helpers');
const User = require('../models/User');
const challengeService = require('../services/challengeService');
const verificationService = require('../services/verificationService');
const { hash } = require('../utils/hash');
const { normalizePositionKeys } = require('../utils/registerGenerator');

function createMask(word) {
  const value = String(word).trim();
  return value.length <= 2 ? `${value[0] || ''}${'•'.repeat(Math.max(value.length - 1, 1))}` : `${value[0]}${'•'.repeat(value.length - 2)}${value.at(-1)}`;
}

exports.setup = asyncHandler(async (req, res) => {
  const secretWord = String(req.body.secretWord || '').trim();
  const offset = Number(req.body.offset);
  const positionKeys = normalizePositionKeys(req.body.positionKeys);
  if (!positionKeys) throw new ApiError(400, 'positionKeys must contain two distinct letters.');
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found.');
  user.visualPassword = true;
  user.secretWordHash = hash(secretWord.toLowerCase());
  user.secretWordMask = createMask(secretWord);
  user.secretOffset = offset;
  user.positionKeys = positionKeys;
  await user.save();
  sendSuccess(res, 200, { configured: true, positionKeys });
});

exports.getSetupStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found.');
  sendSuccess(res, 200, { configured: Boolean(user.visualPassword) });
});

exports.createChallenge = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found.');
  sendSuccess(res, 201, await challengeService.createChallenge(user, req.body));
});

exports.verifyChallenge = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) throw new ApiError(404, 'User not found.');
  sendSuccess(res, 200, await verificationService.verifyChallenge({
    user,
    challengeId: req.body.challengeId,
    visualPasswordRegister: req.body.visualPasswordRegister,
    amount: req.body.amount,
    recipientRegister: req.body.recipientRegister,
}));
});
