const mongoose = require('mongoose');

/**
 * models/VerificationToken.js
 *
 * The token issued once a Challenge is fully verified by the Visual
 * Password SDK, which the backend will later present to Turnkey to
 * authorize signing. Only the schema is defined here -- no token is
 * ever generated or validated by this codebase yet.
 */
const verificationTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },
    challengeId: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('VerificationToken', verificationTokenSchema);
