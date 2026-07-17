const mongoose = require('mongoose');

/**
 * models/User.js
 *
 * A local record tying an email to its Turnkey identity and wallet.
 * Turnkey owns the actual authentication (passkeys) and wallet
 * (embedded wallet, keys) -- this model just references those by ID.
 *
 * `email` is intentionally optional: per Turnkey's own user model
 * (see react-wallet-kit's `user.userEmail`), a user's email is just
 * one of several possible auth methods (alongside passkeys, phone,
 * and OAuth) and is not guaranteed to be present -- a user who signs
 * up with a passkey only, without ever linking an email, will have
 * no `userEmail` on their Turnkey user object at all.
 */
const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: false,
      unique: true,
      sparse: true, // allows any number of documents with no email
      lowercase: true,
      trim: true,
      default: undefined, // never persist "" -- keep it truly absent for the sparse index
    },
    turnkeyUserId: {
      type: String,
      required: true,
      unique: true,
    },
    walletId: {
      type: String,
      default: null,
    },
    walletAddress: {
      type: String,
      default: null,
    },
    preferences: {
      notifications: { type: Boolean, default: true },
    },
    organizationId:{
      type:String,
      required:true
    }
  },
  { timestamps: { createdAt: true, updatedAt: true } }
);

module.exports = mongoose.model('User', userSchema);
