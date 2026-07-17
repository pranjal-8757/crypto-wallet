const User = require('../models/User'); const { ApiError } = require('../utils/helpers');
async function getSettings({ userId }) { const user = await User.findById(userId).select('email walletId walletAddress preferences createdAt'); if (!user) throw new ApiError(404, 'User not found.'); return user; }
async function updateSettings({ userId, preferences }) { const user = await User.findByIdAndUpdate(userId, { $set: { preferences } }, { new: true, runValidators: true }).select('email walletId walletAddress preferences createdAt'); if (!user) throw new ApiError(404, 'User not found.'); return user; }
module.exports = { getSettings, updateSettings };
