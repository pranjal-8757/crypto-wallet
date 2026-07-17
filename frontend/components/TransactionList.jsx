import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
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
 * Full transaction cards for the History page -- more detail than the
 * dashboard's RecentTransactions preview (network, tx hash, explorer
 * link).
 *
 * @param {Array} transactions
 */
export default function TransactionList({ transactions = [] }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No matching transactions"
        description="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {transactions.map((tx) => {
        const isReceived = tx.type === 'received';
        const Icon = isReceived ? ArrowDownLeft : ArrowUpRight;

        return (
          <Card key={tx.id} padding="md">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                    isReceived
                      ? 'bg-success/10 border-success/20 text-success'
                      : 'bg-primary/10 border-primary/20 text-primary-hover'
                  }`}
                >
                  <Icon className="h-4.5 w-4.5" aria-hidden="true" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-text-primary capitalize">{tx.type}</p>
                    <Badge tone={STATUS_TONE[tx.status]} className="capitalize">
                      {tx.status}
                    </Badge>
                  </div>
                  <p className="mt-1 truncate font-mono-data text-xs text-text-secondary">
                    {formatAddress(tx.counterparty)} · {tx.network}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 sm:justify-end">
                <div className="text-right">
                  <p className="font-mono-data text-sm font-medium text-text-primary">
                    {isReceived ? '+' : '-'}
                    {tx.amount} {tx.symbol}
                  </p>
                  <p className="mt-0.5 text-xs text-text-secondary">
                    {formatTimestamp(tx.timestamp)}
                  </p>
                </div>

                <button
                  type="button"
                  aria-label={`View transaction ${formatAddress(tx.hash)} on block explorer`}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-secondary hover:bg-card-hover hover:text-text-primary transition-colors"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <p className="mt-3 border-t border-border pt-3 font-mono-data text-xs text-text-muted">
              {formatAddress(tx.hash, 10, 8)}
            </p>
          </Card>
        );
      })}
    </div>
  );
}
