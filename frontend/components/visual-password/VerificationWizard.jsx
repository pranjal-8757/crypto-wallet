'use client';

import { useState } from 'react';
import ProgressStepper from './ProgressStepper';
import WordChallenge from './WordChallenge';
import AmountVerification from './AmountVerification';
import RecipientVerification from './RecipientVerification';
import VerificationSuccess from '../verification/VerificationSuccess';
import VerificationFailed from '../verification/VerificationFailed';

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
  };

  if (status === 'success') {
    return <VerificationSuccess onDone={onVerified} />;
  }

  if (status === 'failed') {
    return <VerificationFailed onRetry={retry} onCancel={onCancel} />;
  }

  return (
    <div className="vp-theme flex flex-col gap-6">
      <ProgressStepper labels={STAGE_LABELS} currentIndex={stageIndex} />

      {stageIndex === 0 && (
        <WordChallenge
          word={credentials.word}
          offset={credentials.offset}
          positionKeys={credentials.positionKeys}
          onContinue={goNext}
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
          address={transaction?.recipient}
          positionKeys={credentials.positionKeys}
          onContinue={goNext}
          onBack={goBack}
        />
      )}
    </div>
  );
}