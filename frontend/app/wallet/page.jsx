'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Copy, Check, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import NetworkBadge from '@/components/NetworkBadge';
import ReceiveQR from '@/components/ReceiveQR';
import RecentTransactions from '@/components/RecentTransactions';
import { wallet, assets, transactions } from '@/lib/placeholder-data';

const TREND_TONE = { up: 'success', down: 'danger', flat: 'default' };

export default function WalletPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Non-critical -- clipboard access can be denied by the browser.
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Wallet"
        description="Your embedded wallet details, secured and managed by Turnkey."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Details + assets */}
        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card padding="lg">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-text-primary">Wallet Details</h2>
              <NetworkBadge network={wallet.network} />
            </div>

            <dl className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-text-secondary">Wallet Address</dt>
                <dd className="mt-1 flex items-center gap-2">
                  <span className="font-mono-data text-sm text-text-primary truncate">
                    {wallet.address}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-secondary">Wallet ID</dt>
                <dd className="mt-1 font-mono-data text-sm text-text-primary truncate">
                  {wallet.id}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-secondary">Wallet Type</dt>
                <dd className="mt-1 text-sm text-text-primary">{wallet.type}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-secondary">Network</dt>
                <dd className="mt-1 text-sm text-text-primary">{wallet.network}</dd>
              </div>
              <div>
                <dt className="text-xs text-text-secondary">Available Balance</dt>
                <dd className="mt-1 font-mono-data text-sm text-text-primary">
                  {wallet.balanceEth} ETH
                  <span className="ml-1.5 text-xs text-text-secondary">(${wallet.balanceUsd})</span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-text-secondary">Pending Balance</dt>
                <dd className="mt-1 font-mono-data text-sm text-text-primary">
                  {wallet.pendingEth} ETH
                  <span className="ml-1.5 text-xs text-text-secondary">(${wallet.pendingUsd})</span>
                </dd>
              </div>
            </dl>

            <div className="mt-6 flex flex-wrap gap-3 border-t border-border pt-6">
              <Link href="/send">
                <Button icon={<ArrowUpRight className="h-4 w-4" aria-hidden="true" />}>
                  Send
                </Button>
              </Link>
              <Link href="/receive">
                <Button
                  variant="secondary"
                  icon={<ArrowDownLeft className="h-4 w-4" aria-hidden="true" />}
                >
                  Receive
                </Button>
              </Link>
              <Button
                variant="secondary"
                icon={copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
                onClick={handleCopy}
              >
                {copied ? 'Copied' : 'Copy Address'}
              </Button>
              <Button
                variant="ghost"
                icon={<Download className="h-4 w-4" aria-hidden="true" />}
              >
                Download Address
              </Button>
            </div>
          </Card>

          <Card padding="lg">
            <h2 className="text-base font-semibold text-text-primary">Recent Assets</h2>
            <ul className="mt-5 flex flex-col gap-4">
              {assets.map((asset) => (
                <li key={asset.symbol} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-card-hover border border-border text-xs font-semibold text-text-primary">
                      {asset.symbol.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">{asset.name}</p>
                      <p className="font-mono-data text-xs text-text-secondary">
                        {asset.balance} {asset.symbol}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-mono-data text-sm text-text-primary">${asset.usdValue}</p>
                    <Badge tone={TREND_TONE[asset.trend]} className="mt-1">
                      {asset.change}
                    </Badge>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <div>
            <h2 className="mb-4 text-base font-semibold text-text-primary">Recent Activity</h2>
            <RecentTransactions transactions={transactions} limit={4} />
          </div>
        </div>

        {/* Receive QR */}
        <Card padding="lg" className="flex flex-col items-center text-center h-fit">
          <h2 className="text-base font-semibold text-text-primary self-start">Receive</h2>
          <div className="mt-5">
            <ReceiveQR size={200} />
          </div>
          <p className="mt-4 font-mono-data text-xs text-text-secondary break-all">
            {wallet.address}
          </p>
          <Button
            variant="secondary"
            size="sm"
            className="mt-4"
            icon={copied ? <Check className="h-3.5 w-3.5" aria-hidden="true" /> : <Copy className="h-3.5 w-3.5" aria-hidden="true" />}
            onClick={handleCopy}
          >
            {copied ? 'Copied' : 'Copy Address'}
          </Button>
        </Card>
      </div>
    </AppShell>
  );
}
