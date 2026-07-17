import { ShieldX } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Terminal failure state for the recovery wizard -- shown if a step
 * can't be verified (e.g. repeated invalid OTP attempts). Rendered in
 * the Visual Password SDK's warm white/orange theme.
 */
export default function RecoveryFailed({ onRetry, onCancel }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center animate-fade-up">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
        <ShieldX className="h-11 w-11 text-red-500" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[var(--vp-text-primary)]">Recovery Failed</h3>
        <p className="mt-2 max-w-sm text-base leading-relaxed text-[var(--vp-text-secondary)]">
          We couldn&apos;t verify this recovery attempt. Your wallet remains secured and
          unchanged.
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
