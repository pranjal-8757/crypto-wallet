const bcrypt = require('bcrypt');
const User = require('../models/User');
const { ApiError } = require('../utils/helpers');
const { signAccessToken, signRefreshToken, verifyRefreshToken } = require('../config/jwt');

function tokensFor(user) {
  const payload = { sub: user._id.toString(), email: user.email };
  return { accessToken: signAccessToken(payload), refreshToken: signRefreshToken({ sub: payload.sub }) };
}

function safeUser(user) {
  const result = user.toObject ? user.toObject() : user;
  delete result.passwordHash;
  delete result.secretWordHash;
  delete result.secretWordMask;
  delete result.secretOffset;
  delete result.positionKeys;
  return result;
}

function normalizeEmail(email) { return String(email || '').trim().toLowerCase() || undefined; }

async function register({ email, password, turnkeyUserId, organizationId }) {
  const normalizedEmail = normalizeEmail(email);
  if (password) {
    if (!normalizedEmail) throw new ApiError(400, 'Email is required for password registration.');
    if (String(password).length < 10) throw new ApiError(400, 'Password must be at least 10 characters long.');
    if (await User.exists({ email: normalizedEmail })) throw new ApiError(409, 'An account with this email already exists.');
    const user = await User.create({ email: normalizedEmail, passwordHash: await bcrypt.hash(password, Number(process.env.BCRYPT_ROUNDS) || 12) });
    return { user: safeUser(user), ...tokensFor(user) };
  }
  if (!turnkeyUserId || !organizationId) throw new ApiError(400, 'turnkeyUserId and organizationId are required for Turnkey registration.');
  const existing = await User.findOne({ $or: [{ turnkeyUserId }, ...(normalizedEmail ? [{ email: normalizedEmail }] : [])] });
  if (existing) throw new ApiError(409, 'A local account already exists.');
  const user = await User.create({ turnkeyUserId, organizationId, email: normalizedEmail });
  return { user: safeUser(user), ...tokensFor(user) };
}

async function login({ email, password, turnkeyUserId, organizationId }) {
  const normalizedEmail = normalizeEmail(email);
  if (password !== undefined) {
    const user = await User.findOne({ email: normalizedEmail }).select('+passwordHash');
    if (!user || !user.passwordHash || !(await bcrypt.compare(String(password), user.passwordHash))) throw new ApiError(401, 'Invalid email or password.');
    return { user: safeUser(user), ...tokensFor(user) };
  }
  if (!turnkeyUserId || !organizationId) throw new ApiError(400, 'turnkeyUserId and organizationId are required for Turnkey login.');
  let user = await User.findOne({ turnkeyUserId });
  if (!user && normalizedEmail) user = await User.findOne({ email: normalizedEmail });
  if (user) {
    user.turnkeyUserId = turnkeyUserId;
    user.organizationId = organizationId;
    if (normalizedEmail) user.email = normalizedEmail;
    await user.save();
  } else user = await User.create({ turnkeyUserId, organizationId, email: normalizedEmail });
  return { user: safeUser(user), ...tokensFor(user) };
}

async function refresh(refreshToken) {
  if (!refreshToken) throw new ApiError(401, 'Missing refresh token.');
  let sub;
  try { ({ sub } = verifyRefreshToken(refreshToken)); }
  catch { throw new ApiError(401, 'Invalid or expired refresh token.'); }
  const user = await User.findById(sub);
  if (!user) throw new ApiError(401, 'Session is no longer valid.');
  return { user: safeUser(user), ...tokensFor(user) };
}

async function getUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found.');
  return safeUser(user);
}

module.exports = { register, login, refresh, getUser };
