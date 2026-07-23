const { asyncHandler, sendSuccess } = require('../utils/helpers');
const transactionService = require('../services/transactionService');
const walletService = require('../services/walletService');

exports.prepareTransaction = asyncHandler(async (req, res) => {
  const wallet = await walletService.getWalletForUser({ userId: req.user.id });
  const result = await transactionService.prepareTransaction({ userId: req.user.id, walletId: wallet.walletId, ...req.body });
  sendSuccess(res, 201, result);
});
exports.listTransactions = asyncHandler(async (req, res) => sendSuccess(res, 200, await transactionService.listTransactions({ userId: req.user.id, ...req.query })));
exports.getTransaction = asyncHandler(async (req, res) => sendSuccess(res, 200, { transaction: await transactionService.getTransaction({ userId: req.user.id, transactionId: req.params.id }) }));
exports.finalizeTransaction = asyncHandler(async (req, res) => sendSuccess(res, 200, { transaction: await transactionService.finalizeTransaction({ userId: req.user.id, transactionId: req.params.id, verificationPayload: req.body }) }));

exports.start = asyncHandler(async (req, res) => {
  const transaction = await transactionService.startTransaction({ userId: req.user.id, ...req.body });
  sendSuccess(res, 201, transactionService.transactionDraftResponse(transaction));
});
exports.verifyAmount = asyncHandler(async (req, res) => {
  const transaction = await transactionService.verifyAmount({ userId: req.user.id, transactionId: req.body.transactionId, amountCode: req.body.amountCode });
  sendSuccess(res, 200, { transaction });
});
exports.verifyRecipient = asyncHandler(async (req, res) => {
  const transaction = await transactionService.verifyRecipient({ userId: req.user.id, transactionId: req.body.transactionId, recipientCode: req.body.recipientCode });
  sendSuccess(res, 200, { transaction });
});
exports.complete = asyncHandler(async (req, res) => sendSuccess(res, 200, await transactionService.completeTransaction({ userId: req.user.id, transactionId: req.body.transactionId, verificationToken: req.body.verificationToken })));


/* const { asyncHandler, sendSuccess } = require('../utils/helpers'); const transactionService = require('../services/transactionService'); const walletService = require('../services/walletService');
exports.prepareTransaction = asyncHandler(async (req, res) => { const wallet = await walletService.getWalletForUser({ userId: req.user.id }); const result = await transactionService.prepareTransaction({ userId: req.user.id, walletId: wallet.walletId, ...req.body }); sendSuccess(res, 201, result); });
exports.listTransactions = asyncHandler(async (req, res) => sendSuccess(res, 200, await transactionService.listTransactions({ userId: req.user.id, ...req.query })));
exports.getTransaction = asyncHandler(async (req, res) => sendSuccess(res, 200, { transaction: await transactionService.getTransaction({ userId: req.user.id, transactionId: req.params.id }) }));
exports.finalizeTransaction = asyncHandler(async (req, res) => sendSuccess(res, 200, { transaction: await transactionService.finalizeTransaction({ userId: req.user.id, transactionId: req.params.id, verificationPayload: req.body }) }));
*/