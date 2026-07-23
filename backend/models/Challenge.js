const mongoose = require('mongoose');


const challengeSchema = new mongoose.Schema(
  {
    challengeId: { type: String, required: true, unique: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    purpose: { type: String, enum: ['visual-password'], default: 'visual-password' },
    maskedWord: { type: String, required: true },
    challengeNumber: { type: Number, required: true },
    expectedDigits: { type: String, required: true, select: false },
    amount: { type: String, required: true },
    recipientCode: { type: String, required: true, select: false },
    expiresAt: { type: Date, required: true, index: { expires: 0 } },
    used: { type: Boolean, default: false, index: true },
    usedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Challenge', challengeSchema);
