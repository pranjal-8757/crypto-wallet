import { CheckCircle2 } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Terminal success state for the verification flow. Actual signing
 * and broadcast happen afterward via Turnkey -- out of scope here.
 */
export default function VerificationSuccess({ onDone }) {
  return (
    <div className="vp-theme flex flex-col items-center gap-5 py-6 text-center animate-fade-up">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
        <CheckCircle2 className="h-11 w-11 text-green-500" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[var(--vp-text-primary)]">Verification Successful</h3>
        <p className="mt-2 max-w-sm text-base leading-relaxed text-[var(--vp-text-secondary)]">
          This transaction has been securely authorized. Your verification token has been
          generated.
        </p>
      </div>
      <Button theme="light" onClick={onDone} className="mt-2">
        Return to Wallet
      </Button>
    </div>
  );
}
