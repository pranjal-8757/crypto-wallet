const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, sparse: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false, default: undefined },
    // Turnkey fields remain optional so password-only SDK users and existing wallet users coexist.
    turnkeyUserId: { type: String, unique: true, sparse: true, default: undefined },
    organizationId: { type: String, default: undefined },
    walletId: { type: String, default: null },
    walletAddress: { type: String, default: null },
    visualPassword: { type: Boolean, default: false },
    secretWordHash: { type: String, select: false, default: undefined },
    // A masked representation permits a challenge without storing the plaintext secret word.
    secretWordMask: { type: String, default: undefined },
    secretOffset: { type: Number, default: undefined },
    positionKeys: { type: [String], default: undefined },
    preferences: { notifications: { type: Boolean, default: true } },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);



//const mongoose = require('mongoose');

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

/*
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
*/
