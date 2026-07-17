'use client';

import { Mail } from 'lucide-react';
import Button from '../ui/Button';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Email-entry step: asks for the account email tied to the wallet
 * before a recovery attempt begins. Rendered in the Visual Password
 * SDK's warm white/orange theme.
 *
 * @param {string} value
 * @param {(next: string) => void} onChange
 * @param {boolean} loading
 */
export default function EmailInput({ value, onChange, onContinue, loading = false }) {
  const isValid = EMAIL_PATTERN.test(value.trim());

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
          <Mail className="h-4 w-4" aria-hidden="true" />
          Enter your account email
        </div>
        <p className="mt-2 text-base text-[var(--vp-text-secondary)]">
          We&apos;ll send a one-time code to confirm it&apos;s you before starting recovery.
        </p>
      </div>

      <div>
        <label htmlFor="recovery-email" className="mb-1.5 block text-sm font-semibold text-[var(--vp-text-primary)]">
          Email address
        </label>
        <input
          id="recovery-email"
          type="email"
          placeholder="you@example.com"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="vp-input"
          autoComplete="email"
        />
      </div>

      <Button theme="light" fullWidth loading={loading} disabled={!isValid} onClick={onContinue}>
        Send Code
      </Button>
    </div>
  );
}
