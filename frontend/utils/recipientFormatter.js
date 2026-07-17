/**
 * recipientFormatter.js
 *
 * Pure display-formatting helpers for the recipient-verification step.
 * These only touch presentation (splitting/highlighting characters in
 * an address that's already known) -- they do NOT decide which
 * characters are used for verification or generate any challenge.
 * That selection is a backend security concern (see
 * services/verificationService.js).
 */

/**
 * Splits an address into a "body" and a highlighted "tail" of a given
 * length, for UI emphasis (e.g. highlighting the last 2 characters).
 *
 * @param {string} address
 * @param {number} tailLength
 * @returns {{ body: string, tail: string }}
 */
export function splitAddressTail(address, tailLength = 2) {
  if (!address || address.length <= tailLength) {
    return { body: '', tail: address || '' };
  }
  return {
    body: address.slice(0, address.length - tailLength),
    tail: address.slice(-tailLength),
  };
}

/**
 * Breaks the highlighted tail into individual characters paired with
 * a display index, for rendering one "position key" selector per
 * character (e.g. a dropdown for the 41st character, another for the
 * 42nd).
 *
 * @param {string} tail
 * @returns {Array<{ index: number, char: string }>}
 */
export function getTailPositions(tail) {
  return tail.split('').map((char, i) => ({ index: i, char }));
}

/**
 * Will request which character positions the backend wants the user
 * to confirm for a given address/transaction. The frontend never
 * decides this on its own.
 *
 * Future implementation calls:
 *   POST /v1/challenge/recipient
 *   body: { address: string, walletId: string }
 *   response: { challengeId: string, positions: number[] }
 *
 * @param {{ address: string, walletId: string }} _params
 * @returns {Promise<{ challengeId: string, positions: number[] }>}
 */
export async function getRecipientVerificationPositions(_params) {
  throw new Error(
    'getRecipientVerificationPositions() is not implemented. Position selection is server-side.'
  );
}
