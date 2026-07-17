import { ShieldCheck } from 'lucide-react';

/**
 * Full-screen loading state shown during auth checks, wallet
 * initialization, or route transitions.
 *
 * @param {string} label - status text shown under the mark
 */
export default function Loading({ label = 'Loading your wallet…' }) {
  return (
    <div
      className="grid-motif flex min-h-screen flex-col items-center justify-center gap-6 bg-bg"
      role="status"
      aria-live="polite"
    >
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-border" />
        <span className="absolute inset-0 rounded-full border-2 border-t-primary border-r-transparent border-b-transparent border-l-transparent animate-spin" />
        <ShieldCheck className="h-6 w-6 text-primary" aria-hidden="true" />
      </div>

      <div className="text-center">
        <p className="font-display text-sm font-semibold tracking-wide text-text-primary">
          VAULT
        </p>
        <p className="mt-1 text-sm text-text-secondary">{label}</p>
      </div>
    </div>
  );
}
