const { asyncHandler, sendSuccess } = require('../utils/helpers'); const verificationService = require('../services/verificationService');
exports.startChallenge = asyncHandler(async (req, res) => sendSuccess(res, 201, { challenge: await verificationService.startChallenge({ userId: req.user.id, ...req.body }) }));
exports.verifyChallenge = asyncHandler(async (req, res) => sendSuccess(res, 200, { verification: await verificationService.verifyChallenge({ userId: req.user.id, ...req.body }) }));
exports.cancelChallenge = asyncHandler(async (req, res) => sendSuccess(res, 200, { message: 'Challenge cancellation requires the finalized Visual Password API contract.' }));
