/**
 * Pure display-formatting helpers shared across wallet UI. No network
 * or business logic lives here -- just string/number presentation.
 */

/**
 * Shortens a wallet address or tx hash to `0x1234…abcd` form.
 */
export function formatAddress(value, leading = 6, trailing = 4) {
  if (!value || value.length <= leading + trailing) return value;
  return `${value.slice(0, leading)}…${value.slice(-trailing)}`;
}

/**
 * Formats a relative-ish timestamp label from an ISO string for
 * placeholder transaction data.
 */
export function formatTimestamp(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}
