const { asyncHandler, sendSuccess } = require('../utils/helpers');
const walletService = require('../services/walletService');

exports.getWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWalletForUser({ userId: req.user.id });
  sendSuccess(res, 200, { wallet });
});

exports.saveWallet = asyncHandler(async (req, res) => {
  const wallet = await walletService.saveWalletForUser({
    userId: req.user.id,
    walletId: req.body.walletId,
    walletAddress: req.body.walletAddress,
  });
  sendSuccess(res, 200, { wallet });
});

exports.getBalance = asyncHandler(async (req, res) => {
  const balance = await walletService.getBalance({ userId: req.user.id });
  return sendSuccess(res, 200, { balance });
});
