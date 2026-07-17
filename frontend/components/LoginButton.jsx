'use client';

import { Fingerprint } from 'lucide-react';
import Button from './ui/Button';

/**
 * Primary call-to-action for passkey authentication.
 *
 * Purely presentational at this stage -- `onLogin` is left for the auth
 * integration phase to wire up against Turnkey's passkey flow.
 *
 * @param {() => void} onLogin
 * @param {boolean} loading
 * @param {boolean} disabled
 */
export default function LoginButton({ onLogin, loading = false, disabled = false, className = '' }) {
  return (
    <Button
      onClick={onLogin}
      loading={loading}
      disabled={disabled}
      icon={<Fingerprint className="h-4 w-4" aria-hidden="true" />}
      size="lg"
      className={className}
      aria-label="Sign in with your passkey"
    >
      {loading ? 'Verifying passkey…' : 'Sign in with Passkey'}
    </Button>
  );
}
