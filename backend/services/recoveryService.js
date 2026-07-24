const crypto = require('crypto');
const bcrypt = require('bcrypt');
const Recovery = require('../models/Recovery');
const User = require('../models/User');
const { ApiError } = require('../utils/helpers');
const { generateOtp } = require('../utils/otp');

const OTP_TTL_MS = 5 * 60 * 1000;

async function sendOtpEmail({ email, otp }) {
  let nodemailer;
  try { nodemailer = require('nodemailer'); }
  catch { throw new ApiError(503, 'Recovery email delivery is not configured.'); }
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, to: email, subject: 'Your Vault recovery code', text: `Your recovery code is ${otp}. It expires in 5 minutes.` });
}

async function startRecovery({ email }) {
  const user = await User.findOne({ email: String(email).trim().toLowerCase() });
  if (!user) throw new ApiError(404, 'No account matches that email address.');
  const now = new Date();
  await Recovery.updateMany({ userId: user._id, verified: false, expiresAt: { $gt: now } }, { $set: { expiresAt: now, otpExpiresAt: now } });
  const otp = generateOtp(6);
  const expiresAt = new Date(Date.now() + OTP_TTL_MS);
  const recoveryId = crypto.randomUUID();
  const recovery = await Recovery.create({ recoveryId, userId: user._id, email: user.email, otpHash: await bcrypt.hash(otp, Number(process.env.BCRYPT_ROUNDS) || 12), otpExpiresAt: expiresAt, expiresAt, attempts: 0, verified: false });
  await sendOtpEmail({ email: user.email, otp });
  return { recoveryId: recovery.recoveryId, expiresIn: 300 };
}

async function verifyEmail({ recoveryId, otp }) {
  const recovery = await Recovery.findOne({ recoveryId }).select('+otpHash');
  if (!recovery || recovery.expiresAt <= new Date() || recovery.otpExpiresAt <= new Date()) throw new ApiError(400, 'Recovery code has expired.');
  if (recovery.attempts >= 5) throw new ApiError(429, 'Too many verification attempts.');
  recovery.attempts += 1;
  if (!recovery.otpHash || !(await bcrypt.compare(String(otp), recovery.otpHash))) { await recovery.save(); throw new ApiError(400, 'Invalid recovery code.'); }
  recovery.verified = true;
  recovery.emailVerified = true;
  recovery.recoveryStatus = 'email_verified';
  recovery.otpHash = undefined;
  await recovery.save();
  return { verified: true };
}

module.exports = { startRecovery, verifyEmail };
