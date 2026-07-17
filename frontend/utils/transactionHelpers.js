/**
 * transactionHelpers.js
 *
 * Presentation-only helpers for transaction lists/tables. No
 * blockchain calls, no signing, no business logic beyond arranging
 * already-known data for display.
 */

export const STATUS_TONE = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

/**
 * Maps a transaction status to a Badge tone.
 * @param {'completed'|'pending'|'failed'} status
 */
export function getStatusTone(status) {
  return STATUS_TONE[status] ?? 'default';
}

/**
 * Slices a list into a single page of items.
 * @param {Array} items
 * @param {number} page - 1-indexed
 * @param {number} pageSize
 */
export function paginate(items, page = 1, pageSize = 5) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

/**
 * Total number of pages for a given item count and page size.
 */
export function getPageCount(totalItems, pageSize = 5) {
  return Math.max(1, Math.ceil(totalItems / pageSize));
}

/**
 * Builds a block-explorer URL for a transaction hash.
 *
 * This is a placeholder only -- no real explorer integration exists
 * yet, and the network-to-explorer-domain mapping will likely move to
 * config once real chains are wired up.
 *
 * @param {string} _hash
 * @param {string} _network
 * @returns {string}
 */
export function getExplorerUrl(_hash, _network) {
  return '#';
}
