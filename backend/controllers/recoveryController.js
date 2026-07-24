const { asyncHandler, sendSuccess } = require('../utils/helpers'); const recoveryService = require('../services/recoveryService');
exports.startRecovery = asyncHandler(async (req, res) => sendSuccess(res, 201, await recoveryService.startRecovery(req.body)));
exports.verifyEmail = asyncHandler(async (req, res) => sendSuccess(res, 200, await recoveryService.verifyEmail(req.body)));
