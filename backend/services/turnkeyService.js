const { Turnkey } = require('@turnkey/sdk-server');
const { ApiError } = require('../utils/helpers');
const config = require('../config/turnkey');

let turnkeyClient;

function getTurnkeyClient() {
  if (!config.apiPublicKey || !config.apiPrivateKey || !config.organizationId) {
    throw new ApiError(503, 'Turnkey server credentials are not configured.');
  }

  if (!turnkeyClient) {
    turnkeyClient = new Turnkey({
      apiBaseUrl: config.apiBaseUrl,
      apiPublicKey: config.apiPublicKey,
      apiPrivateKey: config.apiPrivateKey,
      defaultOrganizationId: config.organizationId,
    });
  }

  return turnkeyClient;
}

/**
 * Resolves the identity that the already-authenticated Wallet Kit session
 * exposes after handleLogin(): session.userId and session.organizationId.
 * The email, if any, is sourced from Turnkey's v1User.userEmail response --
 * it is one of several optional auth methods (alongside passkeys, phone,
 * and OAuth) and is not guaranteed to be present, so it is never required
 * here.
 */
async function getAuthenticatedUser({ userId, organizationId }) {
  if (!userId || !organizationId) {
    throw new ApiError(400, 'Turnkey userId and organizationId are required.');
  }

  try {
  const response = await getTurnkeyClient().apiClient().getUser({
    userId,
    organizationId,
  });

  console.log("===== TURNKEY RESPONSE =====");
  console.dir(response, { depth: null });
  console.log("============================");

  const user = response?.user;

  if (!user?.userId || user.userId !== userId) {
    throw new ApiError(401, "The Turnkey user could not be verified.");
  }

  return {
    email: user.userEmail || undefined,
    turnkeyUserId: user.userId,
    organizationId,
  };
} catch (error) {
  console.error("TURNKEY ERROR:");
  console.error(error);

  if (error instanceof ApiError) throw error;

  throw new ApiError(401, "Unable to verify the Turnkey user.");
}
}

module.exports = { getAuthenticatedUser };
