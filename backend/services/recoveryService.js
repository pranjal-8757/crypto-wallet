const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Recovery = require('../models/Recovery');
const User = require('../models/User');
const { ApiError } = require('../utils/helpers');
const challengeService = require('./challengeService');
const verificationService = require('./verificationService');
const { generateRecoveryAuthorizationToken } = require('./tokenService');

const OTP_TTL_MS = 10 * 60 * 1000;
const RECOVERY_TTL_MS = 60 * 60 * 1000;

async function getRecovery(recoveryId) {
  const recovery = await Recovery.findById(recoveryId).populate('userId');
  if (!recovery || recovery.expiresAt < new Date()) throw new ApiError(400, 'Recovery request has expired.');
  return recovery;
}

async function startRecovery({ email }) {
  const user = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (!user) throw new ApiError(404, 'No account matches that email address.');
  const otp = crypto.randomInt(100000, 1000000).toString();
  const recovery = await Recovery.create({
    userId: user._id,
    email: user.email,
    otpHash: await bcrypt.hash(otp, Number(process.env.BCRYPT_ROUNDS) || 12),
    otpExpiresAt: new Date(Date.now() + OTP_TTL_MS),
    expiresAt: new Date(Date.now() + RECOVERY_TTL_MS),
  });
  // Email delivery is supplied by the deployment; development exposes the code for local testing.
  return { recoveryId: recovery._id, expiresAt: recovery.expiresAt, ...(process.env.NODE_ENV === 'development' ? { developmentOtp: otp } : {}) };
}

async function verifyEmail({ recoveryId, otp }) {
  const recovery = await Recovery.findById(recoveryId).select('+otpHash');
  if (!recovery || recovery.expiresAt < new Date()) throw new ApiError(400, 'Recovery request has expired.');
  if (recovery.attempts >= 5) throw new ApiError(429, 'Too many verification attempts.');
  recovery.attempts += 1;
  if (!recovery.otpExpiresAt || !(await bcrypt.compare(String(otp), recovery.otpHash))) {
    await recovery.save();
    throw new ApiError(400, 'Invalid or expired one-time code.');
  }
  recovery.emailVerified = true;
  recovery.recoveryStatus = 'email_verified';
  recovery.otpHash = undefined;
  await recovery.save();
  return recovery;
}

async function startVisualPasswordChallenge({ recoveryId }) {
  const recovery = await getRecovery(recoveryId);
  if (!recovery.emailVerified) throw new ApiError(409, 'Verify email before the Visual Password step.');
  const user = recovery.userId;
  if (!user.walletAddress) throw new ApiError(409, 'A wallet address is required for recovery verification.');
  const transaction = { recipient: user.walletAddress, amount: 'Recovery', network: 'Account Recovery', symbol: '' };
  return { challenge: await challengeService.createChallenge(user, transaction), transaction };
}

async function verifyRecovery({ recoveryId, verificationPayload }) {
  const recovery = await getRecovery(recoveryId);
  if (!recovery.emailVerified) throw new ApiError(409, 'Verify email before the Visual Password step.');
  const result = await verificationService.verifyChallenge({ user: recovery.userId, ...verificationPayload });
  if (!result.verified) throw new ApiError(403, 'Visual Password verification was not accepted.');
  recovery.visualPasswordVerified = true;
  recovery.recoveryStatus = 'visual_password_verified';
  await recovery.save();
  return { verified: true, recoveryAuthorizationToken: generateRecoveryAuthorizationToken({ userId: recovery.userId._id, recoveryId: recovery._id }) };
}

module.exports = { startRecovery, verifyEmail, startVisualPasswordChallenge, verifyRecovery };
