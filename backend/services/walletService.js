const { JsonRpcProvider, formatEther, isAddress, parseEther } = require('ethers');
const User = require('../models/User');
const { ApiError } = require('../utils/helpers');
const logger = require('../utils/logger');
const turnkeyService = require('./turnkeyService');

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

async function sendEth({ userId, recipientAddress, amount }) {
  if (!isAddress(recipientAddress)) throw new ApiError(400, 'Recipient must be a valid Ethereum address.');
  if (typeof amount !== 'string' || !/^\d+(\.\d+)?$/.test(amount)) throw new ApiError(400, 'Amount must be a valid ETH value.');

  let value;
  try { value = parseEther(amount); } catch { throw new ApiError(400, 'Amount must be a valid ETH value.'); }
  if (value <= 0n) throw new ApiError(400, 'Amount must be greater than zero.');

  const user = await User.findById(userId).select('walletId walletAddress organizationId');
  if (!user) throw new ApiError(404, 'User not found.');
  if (!user.walletId || !user.walletAddress) throw new ApiError(404, 'Wallet not found for this user.');
  if (!isAddress(user.walletAddress)) throw new ApiError(400, 'The stored wallet address is invalid.');
  if (!process.env.SEPOLIA_RPC_URL) throw new ApiError(503, 'Ethereum Sepolia RPC is unavailable.');

  const provider = new JsonRpcProvider(process.env.SEPOLIA_RPC_URL);
  try {
    const [balance, feeData, nonce, gasLimit] = await Promise.all([
      provider.getBalance(user.walletAddress),
      provider.getFeeData(),
      provider.getTransactionCount(user.walletAddress, 'pending'),
      provider.estimateGas({ from: user.walletAddress, to: recipientAddress, value }),
    ]);
    const maxFeePerGas = feeData.maxFeePerGas;
    const maxPriorityFeePerGas = feeData.maxPriorityFeePerGas;
    if (!maxFeePerGas || !maxPriorityFeePerGas) throw new ApiError(503, 'Ethereum Sepolia fee data is unavailable.');
    const totalCost = value + (gasLimit * maxFeePerGas);
    if (balance < totalCost) throw new ApiError(400, 'Insufficient ETH balance to cover the amount and network fee.');

    const transactionHash = await turnkeyService.sendEthereumTransaction({
      organizationId: user.organizationId,
      from: user.walletAddress,
      to: recipientAddress,
      value: value.toString(),
      nonce: String(nonce),
      gasLimit: gasLimit.toString(),
      maxFeePerGas: maxFeePerGas.toString(),
      maxPriorityFeePerGas: maxPriorityFeePerGas.toString(),
    });
    return { success: true, transactionHash, recipientAddress, amount, network: NETWORK, timestamp: new Date().toISOString() };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    logger.error('Ethereum Sepolia send failed.');
    throw new ApiError(502, 'Unable to submit the Ethereum transaction.');
  }
}

module.exports = { getWalletForUser, saveWalletForUser, getBalance, sendEth };
