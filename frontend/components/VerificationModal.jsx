'use client';

import { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from './ui/Modal';
import Button from './ui/Button';
import VisualPasswordChallenge from './verification/VisualPasswordChallenge';
import AmountVerification from './verification/AmountVerification';
import RecipientVerification from './verification/RecipientVerification';
import VerificationSuccess from './verification/VerificationSuccess';
import VerificationFailed from './verification/VerificationFailed';
import { useVerification } from '@/hooks/useVerification';
import { formatAddress } from '@/lib/format';

const STEP_META = {
  'visual-password': { phase: 'Visual Password Verification', label: 'Pattern Challenge' },
  amount: { phase: 'Transaction Verification', label: 'Amount Verification' },
  recipient: { phase: 'Transaction Verification', label: 'Recipient Verification' },
  summary: { phase: 'Transaction Verification', label: 'Review & Confirm' },
};

/**
 * Appears after Send -> Continue, before Turnkey ever signs anything.
 * Walks the user through Visual Password -> Amount -> Recipient ->
 * Summary, then simulates a Confirm step.
 *
 * This is the Visual Password SDK's own surface, so it intentionally
 * looks nothing like the rest of the dark crypto dashboard -- it uses
 * the calm, warm white/orange "security verification" theme (see
 * `.vp-theme` in app/globals.css) instead.
 *
 * `transaction` is the draft prepared on the Send page (recipient,
 * amount, symbol, network). On success, `onVerified` is called with
 * that same draft -- in production this is where the resulting
 * verification token would be handed to Turnkey for signing.
 *
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {{ recipient: string, amount: string, symbol: string, network: string }} transaction
 * @param {(transaction: object) => void} onVerified
 */
export default function VerificationModal({ open, onClose, transaction, onVerified }) {
  const verification = useVerification();
  const { step, steps, stepIndex, status, goBack, goNext, submit, reset } = verification;

  useEffect(() => {
    if (!open) reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const handleClose = () => {
    reset();
    onClose?.();
  };

  const renderStep = () => {
    if (status === 'success') {
      return (
        <VerificationSuccess
          onDone={() => {
            onVerified?.(transaction);
            handleClose();
          }}
        />
      );
    }

    if (status === 'failed') {
      return (
        <VerificationFailed
          onRetry={() => {
            reset();
          }}
          onCancel={handleClose}
        />
      );
    }

    switch (step) {
      case 'visual-password':
        return <VisualPasswordChallenge onContinue={goNext} />;
      case 'amount':
        return (
          <AmountVerification
            amount={transaction?.amount}
            symbol={transaction?.symbol}
            onContinue={goNext}
            onBack={goBack}
          />
        );
      case 'recipient':
        return (
          <RecipientVerification
            address={transaction?.recipient}
            onContinue={goNext}
            onBack={goBack}
          />
        );
      case 'summary':
      default:
        return (
          <div className="vp-theme flex flex-col gap-6">
            <div>
              <h3 className="text-lg font-bold text-[var(--vp-text-primary)]">Review &amp; Confirm</h3>
              <p className="mt-1.5 text-base text-[var(--vp-text-secondary)]">
                Everything checks out. Confirm to hand this off to Turnkey for signing.
              </p>
            </div>

            <div className="vp-card divide-y divide-[var(--vp-border)] px-5">
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-[var(--vp-text-secondary)]">Recipient</span>
                <span className="font-mono-data text-sm font-semibold text-[var(--vp-text-primary)]">
                  {formatAddress(transaction?.recipient, 8, 6)}
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-[var(--vp-text-secondary)]">Amount</span>
                <span className="font-mono-data text-sm font-semibold text-[var(--vp-text-primary)]">
                  {transaction?.amount} {transaction?.symbol}
                </span>
              </div>
              <div className="flex items-center justify-between py-4">
                <span className="text-sm text-[var(--vp-text-secondary)]">Network</span>
                <span className="text-sm font-semibold text-[var(--vp-text-primary)]">
                  {transaction?.network}
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 rounded-2xl border border-orange-200 bg-orange-50 px-4 py-3.5">
              <AlertTriangle className="h-4 w-4 shrink-0 text-[var(--vp-primary)] mt-0.5" aria-hidden="true" />
              <p className="text-sm leading-relaxed text-[var(--vp-text-secondary)]">
                You are about to authorize this transaction.
              </p>
            </div>

            <div className="flex gap-3">
              <Button theme="light" variant="secondary" fullWidth onClick={goBack}>
                Back
              </Button>
              <Button theme="light" fullWidth loading={status === 'verifying'} onClick={submit}>
                Confirm
              </Button>
            </div>
          </div>
        );
    }
  };

  const showProgress = status !== 'success' && status !== 'failed';
  const meta = STEP_META[step] || {};

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={showProgress ? meta.phase : 'Visual Password Verification'}
      theme="light"
      maxWidth="xl"
    >
      <div className="vp-theme flex flex-col gap-6">
        {showProgress && (
          <div>
            <div className="flex items-center justify-between text-sm font-medium text-[var(--vp-text-secondary)]">
              <span>{meta.label}</span>
              <span>
                Step {stepIndex + 1} of {steps.length}
              </span>
            </div>
            <div className="vp-progress-track mt-2.5">
              <div
                className="vp-progress-fill"
                style={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {renderStep()}
      </div>
    </Modal>
  );
}
