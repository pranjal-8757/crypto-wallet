const mongoose = require('mongoose');

/**
 * models/Wallet.js
 *
 * Local mirror of a Turnkey-managed embedded wallet. Turnkey is the
 * source of truth for keys/signing -- this record just tracks which
 * wallet belongs to which user and its last-known status.
 */
const walletSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
    walletId: {
      type: String,
      required: true,
      unique: true,
    },
    address: {
      type: String,
      required: true,
    },
    network: {
      type: String,
      required: true,
      default: 'Ethereum Sepolia',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'recovering'],
      default: 'active',
    },
    balance: { type: String, default: '0' },
    balanceSymbol: { type: String, default: 'ETH' },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('Wallet', walletSchema);
