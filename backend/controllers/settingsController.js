const { asyncHandler, sendSuccess } = require('../utils/helpers'); const settingsService = require('../services/settingsService');
exports.getSettings = asyncHandler(async (req, res) => sendSuccess(res, 200, { settings: await settingsService.getSettings({ userId: req.user.id }) }));
exports.updateSettings = asyncHandler(async (req, res) => sendSuccess(res, 200, { settings: await settingsService.updateSettings({ userId: req.user.id, preferences: req.body.preferences }) }));
