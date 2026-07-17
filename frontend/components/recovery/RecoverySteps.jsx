import { Check } from 'lucide-react';

const LABELS = {
  start: 'Start',
  email: 'Email',
  otp: 'Verify OTP',
  'visual-password': 'Visual Password',
  'new-passkey': 'New Passkey',
  complete: 'Complete',
};

/**
 * Horizontal progress stepper for the recovery wizard. Rendered in
 * the Visual Password SDK's warm white/orange theme -- see
 * `.vp-theme` in app/globals.css.
 *
 * @param {string[]} steps
 * @param {number} currentIndex
 */
export default function RecoverySteps({ steps, currentIndex }) {
  return (
    <ol className="flex items-center">
      {steps.map((stepKey, i) => {
        const isComplete = i < currentIndex;
        const isCurrent = i === currentIndex;
        const isLast = i === steps.length - 1;

        return (
          <li key={stepKey} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
                  isComplete
                    ? 'border-[var(--vp-primary)] bg-[var(--vp-primary)] text-white'
                    : isCurrent
                      ? 'border-[var(--vp-primary)] text-[var(--vp-primary-hover)] bg-orange-50'
                      : 'border-[var(--vp-border)] text-[var(--vp-text-muted)] bg-white'
                }`}
                aria-current={isCurrent ? 'step' : undefined}
              >
                {isComplete ? <Check className="h-4 w-4" aria-hidden="true" /> : i + 1}
              </span>
              <span
                className={`hidden text-[11px] font-medium sm:block ${
                  isCurrent ? 'text-[var(--vp-text-primary)]' : 'text-[var(--vp-text-secondary)]'
                }`}
              >
                {LABELS[stepKey]}
              </span>
            </div>

            {!isLast && (
              <div
                className={`mx-2 h-0.5 flex-1 rounded-full transition-colors ${
                  isComplete ? 'bg-[var(--vp-primary)]' : 'bg-[var(--vp-border)]'
                }`}
                aria-hidden="true"
              />
            )}
          </li>
        );
      })}
    </ol>
  );
}
