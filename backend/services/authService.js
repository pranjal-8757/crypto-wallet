const User = require('../models/User');
const { ApiError } = require('../utils/helpers');
const turnkeyService = require('./turnkeyService');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../config/jwt');

function tokensFor(user) {
  const payload = { sub: user._id.toString(), email: user.email };
  return {
    accessToken: signAccessToken(payload),
    refreshToken: signRefreshToken({ sub: payload.sub }),
  };
}

async function register({
  turnkeyUserId,
  organizationId,
  email,
}) {
  // Turnkey's own user object doesn't guarantee an email (passkey-only
  // signups have none) -- normalize falsy/empty values to `undefined`
  // so it's never persisted as "" and the model's sparse unique index
  // behaves correctly.
  const normalizedEmail = email || undefined;

  const dedupeConditions = [{ turnkeyUserId }];
  if (normalizedEmail) dedupeConditions.push({ email: normalizedEmail });

  const existingUser = await User.findOne({ $or: dedupeConditions });

  if (existingUser) {
    throw new ApiError(
      409,
      "A local account already exists."
    );
  }

try {
    user = await User.create({
        turnkeyUserId,
        organizationId,
        email: normalizedEmail,
    });
} catch (err) {
    console.log("Mongo duplicate error:");
    console.log(err);

    console.log("keyPattern:", err.keyPattern);
    console.log("keyValue:", err.keyValue);

    throw err;
}

  return {
    user,
    ...tokensFor(user),
  };
}

async function login({
  turnkeyUserId,
  organizationId,
  email,
}) {
  console.log("========== LOGIN ==========");
  console.log("Incoming userId:", turnkeyUserId);
  console.log("Incoming email:", email);
  console.log("Incoming organizationId:", organizationId);

  const normalizedEmail = email || undefined;

  // First try Turnkey id
  let user = await User.findOne({
    turnkeyUserId,
  });

  console.log("Found by turnkeyUserId:", user);

  // If not found, try email
  if (!user && normalizedEmail) {
    user = await User.findOne({
      email: normalizedEmail,
    });

    console.log("Found by email:", user);

    // Existing account -> attach Turnkey id
    if (user) {
      console.log("Updating existing user with new Turnkey ID");

      user.turnkeyUserId = turnkeyUserId;
      user.organizationId = organizationId;
      await user.save();
    }
  }

  // Brand new user
// Brand new user
if (!user) {
    try {
        user = await User.create({
            turnkeyUserId,
            organizationId,
            email: normalizedEmail,
        });
    } catch (err) {
        console.log("================================");
        console.log(err);
        console.log("Error code:", err.code);
        console.log("Key Pattern:", err.keyPattern);
        console.log("Key Value:", err.keyValue);
        console.log("================================");

        throw err;
    }
}

  console.log("Final user:", user);
  console.log("==========================");

  return {
    user,
    ...tokensFor(user),
  };
}

async function refresh(refreshToken) {
  if (!refreshToken) throw new ApiError(401, 'Missing refresh token.');
  const { sub } = verifyRefreshToken(refreshToken);
  const user = await User.findById(sub);
  if (!user) throw new ApiError(401, 'Session is no longer valid.');
  return { user, ...tokensFor(user) };
}

async function getUser(userId) {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, 'User not found.');
  return user;
}

module.exports = { register, login, refresh, getUser };
