const mongoose = require('mongoose');

/**
 * models/Challenge.js
 *
 * Represents a single Visual Password SDK challenge (e.g. a pattern,
 * amount, or recipient verification tied to a transaction). This
 * phase only defines the schema so the SDK has somewhere to persist
 * challenges once it's integrated -- no challenge is ever created or
 * verified by this codebase yet.
 */
const challengeSchema = new mongoose.Schema(
  {
    challengeId: {
      type: String,
      required: true,
      unique: true,
    },
    purpose: {
      type: String,
      enum: ['visual-password', 'amount-verification', 'recipient-verification', 'recovery'],
      required: true,
    },
    recipient: {
      type: String,
      default: null,
    },
    amount: {
      type: String,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'verified', 'expired', 'failed'],
      default: 'pending',
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Challenge', challengeSchema);
