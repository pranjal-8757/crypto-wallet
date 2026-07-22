'use client';

import { useEffect, useRef, useState } from 'react';
import ProgressStepper from './ProgressStepper';
import WordChallenge from './WordChallenge';
import AmountVerification from './AmountVerification';
import RecipientVerification from './RecipientVerification';
import VerificationSuccess from '../verification/VerificationSuccess';
import VerificationFailed from '../verification/VerificationFailed';
import { authenticatedFetch } from '@/lib/auth';

const STAGE_LABELS = ['Visual Password', 'Amount', 'Recipient'];

/**
 * Returning-user verification flow: Visual Password Challenge ->
 * Amount Verification -> Recipient Verification -> Success. Each
 * stage renders the same ProgressStepper so its own position is
 * always visible, per spec ("each stage has its own progress
 * indicator").
 *
 * All three stages are mock/local-only: no backend call is made,
 * this is UI only.
 *
 * @param {{ word: string, offset: number, positionKeys: [string, string] }} credentials
 * @param {{ recipient: string, amount: string, symbol: string, network: string }} transaction
 * @param {() => void} onVerified
 * @param {() => void} onCancel
 */
export default function VerificationWizard({ credentials, transaction, onVerified, onCancel }) {
  const [stageIndex, setStageIndex] = useState(0);
  const [status, setStatus] = useState('in-progress'); // in-progress | success | failed
  const [recipientRegisterVersion, setRecipientRegisterVersion] = useState(0);
  const [challenge, setChallenge] = useState(null);
  const [visualPasswordRegister, setVisualPasswordRegister] = useState(null);
  const hasCompleted = useRef(false);

  const startChallenge = async () => {
    setChallenge(null);
    try {
      const response = await authenticatedFetch('/v1/challenge/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transaction),
      });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.message);
      setChallenge(payload.challenge);
    } catch {
      setStatus('failed');
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(startChallenge, 0);
    return () => window.clearTimeout(timer);
    // A challenge must start once per modal instance; retry starts subsequent attempts.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goNext = () => {
    if (stageIndex >= STAGE_LABELS.length - 1) {
      setStatus('success');
    } else {
      setStageIndex((i) => i + 1);
    }
  };

  const goBack = () => setStageIndex((i) => Math.max(i - 1, 0));

  const retry = () => {
    setStageIndex(0);
    setStatus('in-progress');
    setRecipientRegisterVersion((version) => version + 1);
    setVisualPasswordRegister(null);
    startChallenge();
  };

  const verifyChallenge = async ({ register: recipientRegister }) => {
    try {
      const response = await authenticatedFetch('/v1/challenge/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ challengeId: challenge?.challengeId, visualPasswordRegister, amount: amountVerificationCode, recipientRegister }),
      });
      const payload = await response.json();
      if (!response.ok || !payload.verified) return setStatus('failed');
      setChallenge((current) => ({ ...current, verificationToken: payload.verificationToken }));
      setStatus('success');
    } catch {
      setStatus('failed');
    }
  };

  const completeVerification = () => {
    if (hasCompleted.current) return;
    hasCompleted.current = true;
    onVerified?.(challenge?.verificationToken);
  };

  if (status === 'success') {
    return <VerificationSuccess onDone={completeVerification} />;
  }

  if (status === 'failed') {
    return <VerificationFailed onRetry={retry} onCancel={onCancel} />;
  }

  return (
    <div className="vp-theme flex flex-col gap-6">
      <ProgressStepper labels={STAGE_LABELS} currentIndex={stageIndex} />

      {stageIndex === 0 && challenge && (
        <WordChallenge
          word={credentials.word}
          offset={credentials.offset}
          positionKeys={credentials.positionKeys}
          challengeValue={challenge.challengeValue}
          onContinue={({ register }) => { setVisualPasswordRegister(register); goNext(); }}
        />
      )}

      {stageIndex === 1 && (
        <AmountVerification
          amount={transaction?.amount}
          symbol={transaction?.symbol}
          onContinue={goNext}
          onBack={goBack}
        />
      )}

      {stageIndex === 2 && (
        <RecipientVerification
          key={recipientRegisterVersion}
          address={transaction?.recipient}
          positionKeys={credentials.positionKeys}
          onContinue={verifyChallenge}
          onBack={goBack}
        />
      )}
    </div>
  );
}
