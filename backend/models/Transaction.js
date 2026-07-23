const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    walletId: { type: String, default: null },
    recipient: { type: String, required: true },
    amount: { type: String, required: true },
    network: { type: String, required: true },
    memo: { type: String, trim: true, maxlength: 256, default: '' },
    verificationStatus: {
      type: String,
      enum: ['draft', 'amount_verified', 'recipient_verified', 'completed', 'failed'],
      default: 'draft',
    },
    amountVerified: { type: Boolean, default: false },
    recipientVerified: { type: Boolean, default: false },
    verificationToken: { type: String, default: null, select: false },
    signedVerificationToken: { type: String, default: null, select: false },
    // Preserved for the existing wallet transaction API.
    status: { type: String, enum: ['pending', 'verified', 'submitted', 'completed', 'failed'], default: 'pending' },
    txHash: { type: String, default: null },
  },
  { timestamps: true }
);

transactionSchema.index({ userId: 1, createdAt: -1 });
module.exports = mongoose.model('Transaction', transactionSchema);


//const mongoose = require('mongoose');

/**
 * models/Transaction.js
 *
 * Record of a crypto transfer as it moves through: prepared ->
 * verified -> signed (by Turnkey) -> submitted -> confirmed/failed.
 * This backend does not sign or broadcast anything itself; `txHash`
 * and terminal `status` values are populated once Turnkey/the chain
 * report back.
 */
/*
const transactionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },
    walletId: {
      type: String,
      required: true,
    },
    recipient: {
      type: String,
      required: true,
    },
    amount: {
      type: String,
      required: true,
    },
    network: { type: String, required: true },
    memo: { type: String, trim: true, maxlength: 256, default: '' },
    verificationToken: { type: String, default: null, select: false },
    status: {
      type: String,
      enum: ['pending', 'verified', 'submitted', 'completed', 'failed'],
      default: 'pending',
    },
    txHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

transactionSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Transaction', transactionSchema);

*/
