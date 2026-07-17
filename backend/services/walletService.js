const User = require('../models/User');
const { ApiError } = require('../utils/helpers');

async function getWalletForUser({ userId }) {
  const user = await User.findById(userId).select('walletId walletAddress organizationId');
  if (!user) throw new ApiError(404, 'User not found.');
  if (!user.walletId || !user.walletAddress) throw new ApiError(404, 'Wallet not found.');

  return {
    walletId: user.walletId,
    walletAddress: user.walletAddress,
    network: 'Ethereum Sepolia',
  };
}

async function saveWalletForUser({ userId, walletId, walletAddress }) {
  if (!walletId || !walletAddress) {
    throw new ApiError(400, 'walletId and walletAddress are required.');
  }
const user = await User.findByIdAndUpdate(
  userId,
  {
    $set: {
      walletId,
      walletAddress,
    },
  },
  {
    new: true,
    runValidators: true,
  }
);

  if (!user) throw new ApiError(404, 'User not found.');

  return {
    walletId: user.walletId,
    walletAddress: user.walletAddress,
    network: 'Ethereum Sepolia',
  };
}

async function getBalance() {
  throw new ApiError(501, 'Wallet balances are not implemented.');
}

module.exports = { getWalletForUser, saveWalletForUser, getBalance };
