import { XCircle } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Terminal failure state for the verification flow -- shown if a step
 * doesn't match (wrong pattern, wrong code, wrong recipient chars).
 */
export default function VerificationFailed({ onRetry, onCancel }) {
  return (
    <div className="vp-theme flex flex-col items-center gap-5 py-6 text-center animate-fade-up">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <XCircle className="h-11 w-11 text-red-500" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[var(--vp-text-primary)]">Verification Failed</h3>
        <p className="mt-2 max-w-sm text-base leading-relaxed text-[var(--vp-text-secondary)]">
          We couldn&apos;t confirm one or more steps. No transaction has been signed or sent.
        </p>
      </div>
      <div className="mt-2 flex gap-3">
        <Button theme="light" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button theme="light" onClick={onRetry}>
          Try Again
        </Button>
      </div>
    </div>
  );
}