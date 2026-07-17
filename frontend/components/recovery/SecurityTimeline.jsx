import { Check, Circle, Lock } from 'lucide-react';

const CHECKPOINTS = [
  { key: 'email', label: 'Email ownership confirmed' },
  { key: 'otp', label: 'One-time code verified' },
  { key: 'visual-password', label: 'Visual Password confirmed' },
  { key: 'new-passkey', label: 'New passkey registered' },
];

const STEP_ORDER = ['start', 'email', 'otp', 'visual-password', 'new-passkey', 'complete'];

/**
 * Sidebar timeline showing which recovery security checkpoints have
 * been cleared, purely reflecting `currentStep` -- no verification
 * logic lives here. Rendered in the Visual Password SDK's warm
 * white/orange theme.
 *
 * @param {string} currentStep
 */
export default function SecurityTimeline({ currentStep }) {
  const currentIndex = STEP_ORDER.indexOf(currentStep);

  return (
    <div className="vp-card p-5">
      <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-text-primary)]">
        <Lock className="h-4 w-4 text-[var(--vp-primary-hover)]" aria-hidden="true" />
        Recovery Security
      </div>

      <ul className="mt-5 flex flex-col gap-4">
        {CHECKPOINTS.map((checkpoint) => {
          const checkpointIndex = STEP_ORDER.indexOf(checkpoint.key);
          const isComplete = currentIndex > checkpointIndex;
          const isCurrent = currentIndex === checkpointIndex;

          return (
            <li key={checkpoint.key} className="flex items-start gap-2.5">
              {isComplete ? (
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" aria-hidden="true" />
              ) : (
                <Circle
                  className={`mt-0.5 h-4 w-4 shrink-0 ${
                    isCurrent ? 'text-[var(--vp-primary-hover)]' : 'text-[var(--vp-text-muted)]'
                  }`}
                  aria-hidden="true"
                />
              )}
              <span
                className={`text-sm ${
                  isComplete || isCurrent ? 'text-[var(--vp-text-primary)]' : 'text-[var(--vp-text-secondary)]'
                }`}
              >
                {checkpoint.label}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
