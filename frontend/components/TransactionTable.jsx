import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import Badge from './ui/Badge';
import EmptyState from './ui/EmptyState';
import { formatAddress, formatTimestamp } from '@/lib/format';
import { getStatusTone, getExplorerUrl } from '@/utils/transactionHelpers';

/**
 * Dense tabular view of transactions, used on the History page.
 * For the condensed card-style list, see TransactionList.jsx.
 *
 * @param {Array} transactions
 * @param {(tx: object) => void} onSelect - optional; if provided, rows
 *   become clickable/focusable and invoke this with the selected
 *   transaction (used to open a details modal).
 */
export default function TransactionTable({ transactions = [], onSelect }) {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No matching transactions"
        description="Try adjusting your filters or search terms."
      />
    );
  }

  return (
    <div className="surface-card rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[880px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-text-secondary">
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Amount</th>
              <th className="px-5 py-3 font-medium">Recipient</th>
              <th className="px-5 py-3 font-medium">Network</th>
              <th className="px-5 py-3 font-medium">Gas Fee</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Time</th>
              <th className="px-5 py-3 font-medium">Tx Hash</th>
              <th className="px-5 py-3 font-medium text-right">Explorer</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {transactions.map((tx) => {
              const isReceived = tx.type === 'received';
              const Icon = isReceived ? ArrowDownLeft : ArrowUpRight;

              return (
                <tr
                  key={tx.id}
                  onClick={onSelect ? () => onSelect(tx) : undefined}
                  onKeyDown={
                    onSelect
                      ? (event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            onSelect(tx);
                          }
                        }
                      : undefined
                  }
                  tabIndex={onSelect ? 0 : undefined}
                  role={onSelect ? 'button' : undefined}
                  aria-label={onSelect ? `View details for transaction ${formatAddress(tx.hash)}` : undefined}
                  className={`hover:bg-card-hover transition-colors ${onSelect ? 'cursor-pointer' : ''}`}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full border ${
                          isReceived
                            ? 'bg-success/10 border-success/20 text-success'
                            : 'bg-primary/10 border-primary/20 text-primary-hover'
                        }`}
                      >
                        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="capitalize text-text-primary">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono-data whitespace-nowrap text-text-primary">
                    {isReceived ? '+' : '-'}
                    {tx.amount} {tx.symbol}
                  </td>
                  <td className="px-5 py-4 font-mono-data text-text-secondary">
                    {formatAddress(tx.counterparty)}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-text-secondary">{tx.network}</td>
                  <td className="px-5 py-4 font-mono-data whitespace-nowrap text-text-secondary">
                    {tx.gasFee}
                  </td>
                  <td className="px-5 py-4">
                    <Badge tone={getStatusTone(tx.status)} className="capitalize">
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap text-text-secondary">
                    {formatTimestamp(tx.timestamp)}
                  </td>
                  <td className="px-5 py-4 font-mono-data text-text-secondary">
                    {formatAddress(tx.hash)}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <a
                      href={getExplorerUrl(tx.hash, tx.network)}
                      aria-label={`View transaction ${formatAddress(tx.hash)} on block explorer`}
                      onClick={(event) => event.stopPropagation()}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md text-text-secondary hover:bg-bg hover:text-text-primary transition-colors"
                    >
                      <ExternalLink className="h-4 w-4" aria-hidden="true" />
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
