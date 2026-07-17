import { ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';

/**
 * Terminal success state for the recovery wizard. Actual passkey
 * registration happens via Turnkey -- out of scope here. Rendered in
 * the Visual Password SDK's warm white/orange theme.
 */
export default function RecoveryComplete({ onDone }) {
  return (
    <div className="flex flex-col items-center gap-5 py-8 text-center animate-fade-up">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
        <ShieldCheck className="h-11 w-11 text-green-500" aria-hidden="true" />
      </div>
      <div>
        <h3 className="text-xl font-bold text-[var(--vp-text-primary)]">Recovery Complete</h3>
        <p className="mt-2 max-w-sm text-base leading-relaxed text-[var(--vp-text-secondary)]">
          Your new passkey is registered and your wallet is accessible again. You can now sign in
          normally.
        </p>
      </div>
      <Button theme="light" onClick={onDone} className="mt-2">
        Go to Dashboard
      </Button>
    </div>
  );
}
