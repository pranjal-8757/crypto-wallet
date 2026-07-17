'use client';

import { useCallback, useMemo, useState } from 'react';

export const VERIFICATION_STEPS = ['visual-password', 'amount', 'recipient', 'summary'];

/**
 * Drives the VerificationModal's multi-step flow: Visual Password ->
 * Amount -> Recipient -> Summary -> Confirm.
 *
 * All state is local. `submit()` currently simulates a result after a
 * short delay so the success/failure UI can be exercised. Once
 * services/verificationService.js is backed by a real API, `submit()`
 * should call `verificationService.completeVerification(...)` instead
 * of the simulated timeout below.
 */
export function useVerification() {
  const [stepIndex, setStepIndex] = useState(0);
  const [patternSelection, setPatternSelection] = useState([]);
  const [amountCode, setAmountCode] = useState('');
  const [recipientSelections, setRecipientSelections] = useState({});
  const [status, setStatus] = useState('in-progress'); // in-progress | verifying | success | failed

  const step = VERIFICATION_STEPS[stepIndex];
  const isFirstStep = stepIndex === 0;
  const isLastStep = stepIndex === VERIFICATION_STEPS.length - 1;

  const goNext = useCallback(() => {
    setStepIndex((i) => Math.min(i + 1, VERIFICATION_STEPS.length - 1));
  }, []);

  const goBack = useCallback(() => {
    setStepIndex((i) => Math.max(i - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setStepIndex(0);
    setPatternSelection([]);
    setAmountCode('');
    setRecipientSelections({});
    setStatus('in-progress');
  }, []);

  /**
   * Placeholder submission. Replace the setTimeout simulation with:
   *   const result = await verificationService.completeVerification({ ... });
   */
  const submit = useCallback(() => {
    setStatus('verifying');
    setTimeout(() => {
      setStatus('success');
    }, 900);
  }, []);

  const progress = useMemo(
    () => Math.round(((stepIndex + 1) / VERIFICATION_STEPS.length) * 100),
    [stepIndex]
  );

  return {
    step,
    stepIndex,
    steps: VERIFICATION_STEPS,
    progress,
    isFirstStep,
    isLastStep,
    status,
    patternSelection,
    setPatternSelection,
    amountCode,
    setAmountCode,
    recipientSelections,
    setRecipientSelections,
    goNext,
    goBack,
    reset,
    submit,
  };
}
