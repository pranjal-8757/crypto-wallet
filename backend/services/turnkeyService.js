const { randomUUID } = require('crypto');
const Transaction = require('../models/Transaction');
const { ApiError } = require('../utils/helpers');
const { generateAmountCode } = require('../utils/amountCode');
const { extractRecipientCode } = require('../utils/recipientCode');
const verificationService = require('./verificationService');
const turnkeyService = require('./turnkeyService');

async function prepareTransaction({ userId, walletId, recipient, amount, network, memo }) {
  const transaction = await Transaction.create({ userId, transactionId: randomUUID(), walletId, recipient, amount, network, memo });
  try {
    const challenge = await verificationService.startChallenge({ transaction });
    return { transaction, challenge };
  } catch (error) {
    await Transaction.findByIdAndDelete(transaction._id);
    throw error;
  }
}

async function startTransaction({ userId, recipient, amount, network }) {
  const transaction = await Transaction.create({ userId, transactionId: randomUUID(), recipient, amount: String(amount), network, verificationStatus: 'draft' });
  return transaction;
}

async function getTransaction({ userId, transactionId }) {
  const transaction = await Transaction.findOne({ $or: [{ _id: transactionId }, { transactionId }], userId }).select('+verificationToken +signedVerificationToken');
  if (!transaction) throw new ApiError(404, 'Transaction not found.');
  return transaction;
}

async function verifyAmount({ userId, transactionId, amountCode }) {
  const transaction = await getTransaction({ userId, transactionId });
  if (transaction.verificationStatus !== 'draft') throw new ApiError(409, 'Amount verification is not available for this transaction.');
  verificationService.verifyAmount({ transaction, amountCode });
  transaction.amountVerified = true;
  transaction.verificationStatus = 'amount_verified';
  await transaction.save();
  return transaction;
}

async function verifyRecipient({ userId, transactionId, recipientCode }) {
  const transaction = await getTransaction({ userId, transactionId });
  if (!transaction.amountVerified || transaction.verificationStatus !== 'amount_verified') throw new ApiError(409, 'Verify the amount before verifying the recipient.');
  verificationService.verifyRecipient({ transaction, recipientCode });
  transaction.recipientVerified = true;
  transaction.verificationStatus = 'recipient_verified';
  await transaction.save();
  return transaction;
}

async function completeTransaction({ userId, transactionId, verificationToken }) {
  const transaction = await getTransaction({ userId, transactionId });
  if (!transaction.amountVerified || !transaction.recipientVerified || transaction.verificationStatus !== 'recipient_verified') {
    throw new ApiError(409, 'Complete amount and recipient verification before completing the transaction.');
  }
  verificationService.verifyVerificationToken(verificationToken, userId);
  transaction.verificationToken = verificationToken;
  transaction.signedVerificationToken = verificationService.generateVerificationToken({ userId, challengeId: transaction.transactionId });
  transaction.verificationStatus = 'completed';
  transaction.status = 'completed';
  await transaction.save();
  return { transaction, verificationToken: transaction.signedVerificationToken };
}

async function listTransactions({ userId, page = 1, limit = 20 }) {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const [transactions, total] = await Promise.all([
    Transaction.find({ userId }).sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit),
    Transaction.countDocuments({ userId }),
  ]);
  return { transactions, pagination: { page: safePage, limit: safeLimit, total } };
}

async function finalizeTransaction({ userId, transactionId, verificationPayload }) {
  const transaction = await getTransaction({ userId, transactionId });
  if (transaction.status !== 'pending') throw new ApiError(409, 'Transaction is not awaiting verification.');
  const verification = await verificationService.verifyChallenge({ transaction, ...verificationPayload });
  if (!verification?.verificationToken) throw new ApiError(403, 'Visual Password verification was not accepted.');
  const submitted = await turnkeyService.signAndSubmitTransaction({ ...transaction.toObject(), verificationToken: verification.verificationToken });
  transaction.status = 'submitted';
  transaction.txHash = submitted.txHash;
  transaction.verificationToken = verification.verificationToken;
  await transaction.save();
  return transaction;
}

function transactionDraftResponse(transaction) {
  return {
    transaction,
    amountCode: generateAmountCode(transaction.amount),
    recipientCode: extractRecipientCode(transaction.recipient),
  };
}

module.exports = { prepareTransaction, startTransaction, transactionDraftResponse, verifyAmount, verifyRecipient, completeTransaction, listTransactions, getTransaction, finalizeTransaction };


/*const { Turnkey } = require('@turnkey/sdk-server');
const { ApiError } = require('../utils/helpers');
const config = require('../config/turnkey');
const logger = require('../utils/logger');

let turnkeyClient;

function getTurnkeyClient() {
  if (!config.apiPublicKey || !config.apiPrivateKey || !config.organizationId) {
    throw new ApiError(503, 'Turnkey server credentials are not configured.');
  }

  if (!turnkeyClient) {
    turnkeyClient = new Turnkey({
      apiBaseUrl: config.apiBaseUrl,
      apiPublicKey: config.apiPublicKey,
      apiPrivateKey: config.apiPrivateKey,
      defaultOrganizationId: config.organizationId,
    });
  }

  return turnkeyClient;
}

/**
 * Resolves the identity that the already-authenticated Wallet Kit session
 * exposes after handleLogin(): session.userId and session.organizationId.
 * The email, if any, is sourced from Turnkey's v1User.userEmail response --
 * it is one of several optional auth methods (alongside passkeys, phone,
 * and OAuth) and is not guaranteed to be present, so it is never required
 * here.
 */

/*
async function getAuthenticatedUser({ userId, organizationId }) {
  if (!userId || !organizationId) {
    throw new ApiError(400, 'Turnkey userId and organizationId are required.');
  }

  try {
  const response = await getTurnkeyClient().apiClient().getUser({
    userId,
    organizationId,
  });

  console.log("===== TURNKEY RESPONSE =====");
  console.dir(response, { depth: null });
  console.log("============================");

  const user = response?.user;

  if (!user?.userId || user.userId !== userId) {
    throw new ApiError(401, "The Turnkey user could not be verified.");
  }

  return {
    email: user.userEmail || undefined,
    turnkeyUserId: user.userId,
    organizationId,
  };
} catch (error) {
  console.error("TURNKEY ERROR:");
  console.error(error);

  if (error instanceof ApiError) throw error;

  throw new ApiError(401, "Unable to verify the Turnkey user.");
}
}

async function sendEthereumTransaction({ organizationId, from, to, value, nonce, gasLimit, maxFeePerGas, maxPriorityFeePerGas }) {
  try {
    const apiClient = getTurnkeyClient().apiClient();
    const submission = await apiClient.ethSendTransaction({
      organizationId,
      parameters: { from, to, value, nonce, gasLimit, maxFeePerGas, maxPriorityFeePerGas, caip2: 'eip155:11155111' },
    });
    if (!submission?.sendTransactionStatusId) throw new Error('Turnkey did not return a transaction submission status.');

    const status = await apiClient.pollTransactionStatus({
      organizationId,
      sendTransactionStatusId: submission.sendTransactionStatusId,
    });
    const transactionHash = status?.eth?.txHash;
    if (!transactionHash) throw new Error('Turnkey did not return a transaction hash.');
    return transactionHash;
  } catch (error) {
    logger.error('Turnkey rejected or failed to submit an Ethereum transaction.');
    throw new ApiError(502, 'Turnkey was unable to submit the Ethereum transaction.');
  }
}

module.exports = { getAuthenticatedUser, sendEthereumTransaction };
*/