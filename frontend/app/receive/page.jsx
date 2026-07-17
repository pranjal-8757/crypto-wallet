'use client';

import { useState } from 'react';
import { Copy, Check, Share2, Info, ShieldAlert } from 'lucide-react';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ReceiveQR from '@/components/ReceiveQR';
import NetworkBadge from '@/components/NetworkBadge';
import { wallet } from '@/lib/placeholder-data';

const SUPPORTED_NETWORKS = ['Ethereum Sepolia', 'Arbitrum Sepolia', 'Base Sepolia'];

const SECURITY_TIPS = [
  'Only share this address to receive funds -- never your passkey or recovery phrase.',
  'Double-check the network before asking someone to send funds.',
  'Assets sent on an unsupported network may be unrecoverable.',
];

export default function ReceivePage() {
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ text: wallet.address });
      } catch {
        // User cancelled the share sheet -- nothing to do.
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Receive"
        description="Share your address or QR code to receive funds into this wallet."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card padding="lg" className="flex flex-col items-center text-center lg:col-span-1">
          <ReceiveQR size={220} />

          <div className="mt-5 flex items-center gap-2">
            <NetworkBadge network={wallet.network} />
          </div>

          <p className="mt-4 w-full break-all rounded-md border border-border bg-bg px-4 py-3 font-mono-data text-sm text-text-primary">
            {wallet.address}
          </p>

          <div className="mt-5 flex w-full gap-3">
            <Button
              variant="secondary"
              fullWidth
              icon={copied ? <Check className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              onClick={handleCopy}
            >
              {copied ? 'Copied' : 'Copy'}
            </Button>
            <Button
              variant="secondary"
              fullWidth
              icon={<Share2 className="h-4 w-4" aria-hidden="true" />}
              onClick={handleShare}
            >
              Share
            </Button>
          </div>
        </Card>

        <div className="flex flex-col gap-6 lg:col-span-2">
          <Card padding="lg">
            <div className="flex items-center gap-2.5">
              <Info className="h-4.5 w-4.5 text-primary-hover" aria-hidden="true" />
              <h2 className="text-base font-semibold text-text-primary">How to receive funds</h2>
            </div>
            <ol className="mt-4 flex flex-col gap-3 text-sm text-text-secondary list-decimal list-inside">
              <li>Share your wallet address or QR code with the sender.</li>
              <li>Confirm they&apos;re sending on a supported network below.</li>
              <li>Funds typically appear within a few minutes of confirmation.</li>
            </ol>
          </Card>

          <Card padding="lg">
            <h2 className="text-base font-semibold text-text-primary">Supported Networks</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {SUPPORTED_NETWORKS.map((network) => (
                <NetworkBadge key={network} network={network} />
              ))}
            </div>
          </Card>

          <Card padding="lg">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-4.5 w-4.5 text-warning" aria-hidden="true" />
              <h2 className="text-base font-semibold text-text-primary">Security Tips</h2>
            </div>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm text-text-secondary">
              {SECURITY_TIPS.map((tip) => (
                <li key={tip} className="flex gap-2.5">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-text-muted" aria-hidden="true" />
                  {tip}
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
