/**
 * Single label/value row used inside TransactionSummary for fee and
 * estimate line items.
 *
 * @param {string} label
 * @param {string} value
 * @param {boolean} muted - dims the value for secondary line items
 */
export default function FeeCard({ label, value, muted = false }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-text-secondary">{label}</span>
      <span
        className={`font-mono-data text-sm ${muted ? 'text-text-secondary' : 'text-text-primary font-medium'}`}
      >
        {value}
      </span>
    </div>
  );
}
