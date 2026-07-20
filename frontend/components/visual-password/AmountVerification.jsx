'use client';

import { Coins } from 'lucide-react';
import Button from '../ui/Button';

export default function AmountVerification({ amount, symbol, onContinue, onBack }) {
  return <div className="vp-theme flex flex-col gap-6"><div>
    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
      <Coins className="h-4 w-4" />Amount Verification</div>
      <p className="mt-2 text-base text-[var(--vp-text-secondary)]">Confirm that this is the amount you intend to send.</p></div>
      <div className="vp-card px-6 py-8 text-center">
        <p className="text-sm text-[var(--vp-text-secondary)]">Transaction Amount</p>
        <p className="mt-2 font-mono-data text-4xl font-semibold text-[var(--vp-text-primary)]">{amount} {symbol}</p>
        </div>
        <div className="flex gap-3">
          <Button theme="light" variant="secondary" fullWidth onClick={onBack}>Back</Button>
          <Button theme="light" fullWidth onClick={onContinue}>Continue</Button>
          </div>
          </div>;
}

