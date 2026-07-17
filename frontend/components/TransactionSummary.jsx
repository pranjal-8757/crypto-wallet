import Card from './ui/Card';
import FeeCard from './FeeCard';
import { formatAddress } from '@/lib/format';

/**
 * Read-only summary of a not-yet-submitted transaction. Shown on the
 * Send page before the (future) Visual Password confirmation step.
 */
export default function TransactionSummary({
  recipient,
  amount,
  symbol,
  network,
  networkFee,
  estimatedArrival,
}) {
  const hasRecipient = Boolean(recipient);
  const hasAmount = Boolean(amount);

  return (
    <Card padding="lg">
      <h2 className="text-base font-semibold text-text-primary">Transaction Summary</h2>

      <div className="mt-4 divide-y divide-border">
        <FeeCard
          label="Recipient"
          value={hasRecipient ? formatAddress(recipient, 8, 6) : '—'}
        />
        <FeeCard
          label="Amount"
          value={hasAmount ? `${amount} ${symbol}` : '—'}
        />
        <FeeCard label="Network" value={network} muted />
        <FeeCard label="Estimated Network Fee" value={networkFee} muted />
        <FeeCard label="Estimated Arrival" value={estimatedArrival} muted />
      </div>
    </Card>
  );
}
