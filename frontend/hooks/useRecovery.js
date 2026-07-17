'use client';

import { useCallback, useMemo, useState } from 'react';

export const RECOVERY_STEPS = [
  'start',
  'email',
  'otp',
  'visual-password',
  'new-passkey',
  'complete',
];

/**
 * Drives the RecoveryWizard's multi-step flow: Start -> Email -> OTP
 * -> Visual Password -> Register New Passkey -> Complete.
 *
 * All state is local and every "verification" here is simulated so
 * the wizard is fully explorable without a backend. Once
 * services/recoveryService.js is backed by a real API, each
 * `verifyX()` call below should be replaced with the matching
 * recoveryService function.
 */
export function useRecovery() {
  const [stepIndex, setStepIndex] = useState(0);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [status, setStatus] = useState('idle'); // idle | verifying | failed
  const [recoveryId, setRecoveryId] = useState(null);

  const step = RECOVERY_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === RECOVERY_STEPS.length - 1;

  const goNext = useCallback(() => {
    setStatus('idle');
    setStepIndex((i) => Math.min(i + 1, RECOVERY_STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setStatus('idle');
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setStepIndex(0);
    setEmail('');
    setOtp('');
    setStatus('idle');
    setRecoveryId(null);
  }, []);

  /**
   * Placeholder: replace with recoveryService.startRecovery({ email }).
   */
  const submitEmail = useCallback(() => {
    setStatus('verifying');
    setTimeout(() => {
      setRecoveryId(`local-recovery-${Date.now()}`);
      setStatus('idle');
      goNext();
    }, 700);
  }, [goNext]);

  /**
   * Placeholder: replace with recoveryService.verifyRecoveryEmail({ recoveryId, otp }).
   * Any 6-digit code is accepted in this local simulation.
   */
  const submitOtp = useCallback(() => {
    setStatus('verifying');
    setTimeout(() => {
      if (otp.length === 6) {
        setStatus('idle');
        goNext();
      } else {
        setStatus('failed');
      }
    }, 700);
  }, [otp, goNext]);

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / RECOVERY_STEPS.length) * 100),
    [stepIndex]
  );

  return {
    step,
    stepIndex,
    steps: RECOVERY_STEPS,
    progress,
    isFirstStep,
    isLastStep,
    status,
    email,
    setEmail,
    otp,
    setOtp,
    recoveryId,
    goNext,
    goBack,
    reset,
    submitEmail,
    submitOtp,
  };
}
