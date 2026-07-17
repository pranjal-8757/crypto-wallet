/**
 * config/turnkey.js
 *
 * Reads Turnkey credentials/config from the environment so
 * services/turnkeyService.js has somewhere to pull them from once
 * real Turnkey API calls are implemented.
 *
 * IMPORTANT: This file does NOT call Turnkey. It only shapes config.
 * No Turnkey SDK/client is instantiated here yet.
 */

const turnkeyConfig = {
  apiBaseUrl: process.env.TURNKEY_API_BASE_URL || 'https://api.turnkey.com',
  organizationId: process.env.TURNKEY_ORGANIZATION_ID || null,
  apiPublicKey: process.env.TURNKEY_API_PUBLIC_KEY || null,
  apiPrivateKey: process.env.TURNKEY_API_PRIVATE_KEY || null,
};

module.exports = turnkeyConfig;
