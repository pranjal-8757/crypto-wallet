const mongoose = require('mongoose');

/**
 * models/Recovery.js
 *
 * Tracks the state of a single passkey-recovery attempt (email
 * verification, then Visual Password verification, then a new
 * passkey is registered via Turnkey). Only the schema is defined
 * here -- no recovery logic runs yet.
 */
const recoverySchema = new mongoose.Schema(
  {
    recoveryId: { type: String, required: true, unique: true, index: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    verified: { type: Boolean, default: false },
    visualPasswordVerified: {
      type: Boolean,
      default: false,
    },
    recoveryStatus: {
      type: String,
      enum: ['started', 'email_verified', 'visual_password_verified', 'completed', 'failed'],
      default: 'started',
    },
    email: { type: String, required: true, lowercase: true, trim: true },
    otpHash: { type: String, select: false },
    otpExpiresAt: { type: Date },
    attempts: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

recoverySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Recovery', recoverySchema);
