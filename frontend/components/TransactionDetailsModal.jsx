'use client';

import { ArrowUpRight, ArrowDownLeft, ExternalLink } from 'lucide-react';
import Modal from './ui/Modal';
import Badge from './ui/Badge';
import Button from './ui/Button';
import { formatTimestamp } from '@/lib/format';
import { getStatusTone, getExplorerUrl } from '@/utils/transactionHelpers';

/**
 * Full-detail view of a single transaction, opened from a History
 * page table row. Presentational only -- reads the same transaction
 * shape already used by TransactionTable/TransactionList.
 *
 * @param {object|null} transaction
 * @param {() => void} onClose
 */
export default function TransactionDetailsModal({ transaction, onClose }) {
  if (!transaction) return null;

  const isReceived = transaction.type === 'received';
  const Icon = isReceived ? ArrowDownLeft : ArrowUpRight;

  const rows = [
    { label: 'Status', value: <Badge tone={getStatusTone(transaction.status)} className="capitalize">{transaction.status}</Badge> },
    { label: 'Network', value: transaction.network },
    { label: 'Recipient / Sender', value: transaction.counterparty, mono: true },
    { label: 'Transaction Hash', value: transaction.hash, mono: true },
    { label: 'Gas Fee', value: transaction.gasFee, mono: true },
    { label: 'USD Value', value: `$${transaction.usdValue}`, mono: true },
    { label: 'Timestamp', value: formatTimestamp(transaction.timestamp) },
  ];

  return (
    <Modal
      open={Boolean(transaction)}
      onClose={onClose}
      title="Transaction Details"
      footer={
        <Button
          variant="secondary"
          icon={<ExternalLink className="h-4 w-4" aria-hidden="true" />}
          onClick={() => window.open(getExplorerUrl(transaction.hash, transaction.network), '_blank')}
        >
          View on Explorer
        </Button>
      }
    >
      <div className="flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full border ${
            isReceived
              ? 'bg-success/10 border-success/20 text-success'
              : 'bg-primary/10 border-primary/20 text-primary-hover'
          }`}
        >
          <Icon className="h-4.5 w-4.5" aria-hidden="true" />
        </span>
        <div>
          <p className="text-sm font-semibold capitalize text-text-primary">{transaction.type}</p>
          <p className="font-mono-data text-sm text-text-primary">
            {isReceived ? '+' : '-'}
            {transaction.amount} {transaction.symbol}
          </p>
        </div>
      </div>

      <dl className="mt-6 flex flex-col divide-y divide-border">
        {rows.map(({ label, value, mono }) => (
          <div key={label} className="flex items-center justify-between gap-4 py-3">
            <dt className="text-xs text-text-secondary">{label}</dt>
            <dd className={`max-w-[65%] truncate text-right text-sm text-text-primary ${mono ? 'font-mono-data' : ''}`}>
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </Modal>
  );
}
