'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import Card from './ui/Card';
import NetworkBadge from './NetworkBadge';
import { formatAddress } from '@/lib/format';

export default function WalletSummary({ address, walletId, network, balance, symbol, isBalanceLoading }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard access is non-critical.
    }
  };

  return (
    <Card padding="lg" className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2.5"><p className="text-sm text-text-secondary">Wallet Overview</p><NetworkBadge network={network} /></div>
          <p className="mt-4 font-mono-data text-3xl font-semibold text-text-primary sm:text-4xl">{isBalanceLoading ? 'Loading…' : `${balance} ${symbol}`}</p>
          <p className="mt-1 text-sm text-text-secondary">{isBalanceLoading ? 'Retrieving live Sepolia balance…' : 'Live Sepolia balance'}</p>
          <button type="button" onClick={handleCopy} className="mt-5 inline-flex items-center gap-2 rounded-md border border-border bg-bg px-3 py-1.5 font-mono-data text-xs text-text-secondary hover:border-border-hover hover:text-text-primary transition-colors" aria-label="Copy wallet address">
            {copied ? <Check className="h-3.5 w-3.5 text-success" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            {copied ? 'Copied' : formatAddress(address)}
          </button>
          <p className="mt-3 font-mono-data text-xs text-text-muted">Wallet ID: {walletId}</p>
        </div>
      </div>
    </Card>
  );
}
