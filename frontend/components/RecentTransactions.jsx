import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { formatAddress, formatTimestamp } from '@/lib/format';

const STATUS_TONE = {
  completed: 'success',
  pending: 'warning',
  failed: 'danger',
};

/**
 * Compact preview of the most recent transactions, meant for the
 * dashboard. For the full filterable list, see TransactionList.
 *
 * @param {Array} transactions
 * @param {number} limit
 */
export default function RecentTransactions({ transactions = [], limit = 4 }) {
  const items = transactions.slice(0, limit);

  if (items.length === 0) {
    return (
      <EmptyState
        title="No activity yet"
        description="Transactions will show up here once you send or receive funds."
      />
    );
  }

  return (
    <Card padding="none">
      <ul className="divide-y divide-border">
        {items.map((tx) => {
          const isReceived = tx.type === 'received';
          const Icon = isReceived ? ArrowDownLeft : ArrowUpRight;

          return (
            <li key={tx.id} className="flex items-center justify-between gap-4 px-6 py-4">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border ${
                    isReceived
                      ? 'bg-success/10 border-success/20 text-success'
                      : 'bg-primary/10 border-primary/20 text-primary-hover'
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-text-primary">
                    {isReceived ? 'Received' : 'Sent'}
                  </p>
                  <p className="truncate font-mono-data text-xs text-text-secondary">
                    {formatAddress(tx.counterparty)}
                  </p>
                </div>
              </div>

              <div className="shrink-0 text-right">
                <p className="font-mono-data text-sm font-medium text-text-primary">
                  {isReceived ? '+' : '-'}
                  {tx.amount} {tx.symbol}
                </p>
                <p className="mt-0.5 text-xs text-text-secondary">
                  {formatTimestamp(tx.timestamp)}
                </p>
              </div>

              <Badge tone={STATUS_TONE[tx.status]} className="shrink-0 capitalize">
                {tx.status}
              </Badge>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
