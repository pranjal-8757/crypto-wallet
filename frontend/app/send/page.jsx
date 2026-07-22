'use client';

import { useState } from 'react';
import { ShieldAlert, ArrowRight } from 'lucide-react';
import AppShell from '@/components/AppShell';
import PageHeader from '@/components/ui/PageHeader';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import TransactionSummary from '@/components/TransactionSummary';
import VisualPasswordModal from '@/components/visual-password/VisualPasswordModal';
import { wallet } from '@/lib/placeholder-data';

const NETWORKS = ['Ethereum Sepolia', 'Arbitrum Sepolia', 'Base Sepolia'];

export default function SendPage() {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [network, setNetwork] = useState(NETWORKS[0]);
  const [memo, setMemo] = useState('');
  const [verificationOpen, setVerificationOpen] = useState(false);

  const canContinue = recipient.trim().length > 0 && Number(amount) > 0;

  /**
   * This page only PREPARES a transaction -- it never signs or
   * broadcasts one. "Continue" opens the Visual Password SDK's
   * VisualPasswordModal with the prepared draft (recipient, amount,
   * network). On success, the modal's onVerified callback receives
   * that same draft; in production that's where a verification token
   * would be handed to Turnkey to actually sign and submit the
   * transaction. None of that signing/broadcast logic exists yet.
   */
  const handleContinue = () => {
    setVerificationOpen(true);
  };

  const handleVerified = () => {
    // Placeholder: a real implementation would hand the verification
    // token off to Turnkey here, then redirect to a confirmation or
    // history view once the transaction is submitted.
    setVerificationOpen(false);
  };

  return (
    <AppShell>
      <PageHeader
        title="Send"
        description="Prepare a transaction. You'll confirm it in the next step before anything is signed."
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card padding="lg" className="lg:col-span-2">
          <div className="flex flex-col gap-5">
            <div>
              <label htmlFor="recipient" className="mb-1.5 block text-sm font-medium text-text-primary">
                Recipient Address
              </label>
              <input
                id="recipient"
                type="text"
                inputMode="text"
                placeholder="0x…"
                value={recipient}
                onChange={(event) => setRecipient(event.target.value)}
                className="input-field font-mono-data"
                autoComplete="off"
                spellCheck="false"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="amount" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Amount
                </label>
                <div className="relative">
                  <input
                    id="amount"
                    type="number"
                    min="0"
                    step="0.0001"
                    placeholder="0.00"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    className="input-field font-mono-data pr-14"
                  />
                  <span className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-secondary">
                    ETH
                  </span>
                </div>
                {wallet.balanceEth && (
                  <p className="mt-1.5 text-xs text-text-secondary">
                    Available: {wallet.balanceEth} ETH
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="network" className="mb-1.5 block text-sm font-medium text-text-primary">
                  Network
                </label>
                <select
                  id="network"
                  value={network}
                  onChange={(event) => setNetwork(event.target.value)}
                  className="input-field"
                >
                  {NETWORKS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <div className="mb-1.5 flex items-baseline justify-between">
                <label htmlFor="memo" className="block text-sm font-medium text-text-primary">
                  Memo
                </label>
                <span className="text-xs text-text-secondary">Optional</span>
              </div>
              <input
                id="memo"
                type="text"
                placeholder="Add a note for your records"
                value={memo}
                onChange={(event) => setMemo(event.target.value)}
                className="input-field"
              />
            </div>

            <div className="rounded-md border border-warning/30 bg-warning/5 px-4 py-3">
              <div className="flex gap-2.5">
                <ShieldAlert className="h-4 w-4 shrink-0 text-warning mt-0.5" aria-hidden="true" />
                <p className="text-xs leading-relaxed text-text-secondary">
                  Sensitive transfers require Visual Password verification before they can be
                  signed. You&apos;ll be asked to confirm your pattern on the next step.
                </p>
              </div>
            </div>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <TransactionSummary
            recipient={recipient}
            amount={amount}
            symbol="ETH"
            network={network}
            networkFee="0.0021 ETH (~$7.30)"
            estimatedArrival="~15 seconds"
          />

          <Button
            size="lg"
            fullWidth
            disabled={!canContinue}
            onClick={handleContinue}
            icon={<ArrowRight className="h-4 w-4" aria-hidden="true" />}
            className="flex-row-reverse"
          >
            Continue
          </Button>
        </div>
      </div>

      <VisualPasswordModal
        open={verificationOpen}
        onClose={() => setVerificationOpen(false)}
        transaction={{ recipient, amount, symbol: 'ETH', network }}
        onVerified={handleVerified}
      />
    </AppShell>
  );
}

