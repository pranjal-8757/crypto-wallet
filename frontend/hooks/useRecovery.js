'use client';

import { useCallback, useMemo, useState } from 'react';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000';
export const RECOVERY_STEPS = ['start', 'email', 'otp', 'visual-password', 'new-passkey', 'complete'];

export function useRecovery() {
  const [stepIndex, setStepIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('idle');
  const [message, setMessage] = useState('');
  const [recoveryId, setRecoveryId] = useState(null);
  const [resendAvailableAt, setResendAvailableAt] = useState(0);
  const step = RECOVERY_STEPS[stepIndex];
  const goNext = useCallback(() => { setStatus('idle'); setStepIndex((i) => Math.min(i + 1, RECOVERY_STEPS.length - 1)); }, []);
  const goBack = useCallback(() => { setStatus('idle'); setMessage(''); setStepIndex((i) => Math.max(i - 1, 0)); }, []);
  const reset = useCallback(() => { setStepIndex(0); setEmail(''); setOtp(''); setStatus('idle'); setMessage(''); setRecoveryId(null); setResendAvailableAt(0); }, []);
  const requestOtp = useCallback(async ({ advance } = { advance: true }) => {
    setStatus('verifying'); setMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/recovery/start`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || 'Unable to send recovery code.');
      setRecoveryId(payload.recoveryId); setResendAvailableAt(Date.now() + 30_000); setStatus('idle'); setMessage('A recovery code was sent to your email.');
      if (advance) goNext();
    } catch (error) { setStatus('failed'); setMessage(error.message || 'Unable to send recovery code.'); }
  }, [email, goNext]);
  const submitEmail = useCallback(() => requestOtp(), [requestOtp]);
  const submitOtp = useCallback(async () => {
    setStatus('verifying'); setMessage('');
    try {
      const response = await fetch(`${BACKEND_URL}/api/recovery/verify-email`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ recoveryId, otp }) });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.verified) throw new Error(payload.message || 'Unable to verify recovery code.');
      setStatus('idle'); goNext();
    } catch (error) { setStatus('failed'); setMessage(error.message || 'Unable to verify recovery code.'); }
  }, [goNext, otp, recoveryId]);
  return { step, stepIndex, steps: RECOVERY_STEPS, progress: useMemo(() => Math.round(((stepIndex + 1) / RECOVERY_STEPS.length) * 100), [stepIndex]), status, message, email, setEmail, otp, setOtp, recoveryId, resendAvailableAt, goNext, goBack, reset, submitEmail, submitOtp, resendOtp: () => requestOtp({ advance: false }) };
}
