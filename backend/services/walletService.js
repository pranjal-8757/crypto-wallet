const { JsonRpcProvider, formatEther, isAddress } = require('ethers');
const User = require('../models/User');
const { ApiError } = require('../utils/helpers');
const logger = require('../utils/logger');

const NETWORK = 'Ethereum Sepolia';
const EMPTY_BALANCE = Object.freeze({ balance: '0', symbol: 'ETH', network: NETWORK });

async function getWalletForUser({ userId }) {
  const user = await User.findById(userId).select('walletId walletAddress organizationId');
  if (!user) throw new ApiError(404, 'User not found.');
  if (!user.walletId || !user.walletAddress) throw new ApiError(404, 'Wallet not found.');

  return {
    walletId: user.walletId,
    walletAddress: user.walletAddress,
    network: NETWORK,
  };
}

async function saveWalletForUser({ userId, walletId, walletAddress }) {
  if (!walletId || !walletAddress) {
    throw new ApiError(400, 'walletId and walletAddress are required.');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { walletId, walletAddress } },
    { new: true, runValidators: true }
  );

  if (!user) throw new ApiError(404, 'User not found.');

  return {
    walletId: user.walletId,
    walletAddress: user.walletAddress,
    network: NETWORK,
  };
}

async function getBalance({ userId }) {
  const user = await User.findById(userId).select('walletAddress');

  if (!user) throw new ApiError(404, 'User not found.');
  if (!user.walletAddress) throw new ApiError(404, 'Wallet not found for this user.');
  if (!isAddress(user.walletAddress)) throw new ApiError(400, 'The stored wallet address is invalid.');

  const rpcUrl = process.env.SEPOLIA_RPC_URL;
  if (!rpcUrl) {
    logger.error('Sepolia balance lookup skipped because SEPOLIA_RPC_URL is not configured.');
    return EMPTY_BALANCE;
  }

  try {
    const provider = new JsonRpcProvider(rpcUrl);
    const balanceInWei = await provider.getBalance(user.walletAddress);

    return {
      balance: balanceInWei === 0n ? '0' : formatEther(balanceInWei),
      symbol: 'ETH',
      network: NETWORK,
    };
  } catch {
    logger.error('Sepolia balance lookup failed; returning the safe zero-balance response.');
    return EMPTY_BALANCE;
  }
}

module.exports = { getWalletForUser, saveWalletForUser, getBalance };
