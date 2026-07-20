'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import WordSelect from './WordSelect';
import { MOCK_WORDS } from '@/lib/mockWords';
import { POSITION_KEYS } from './RegisterInputs';

export default function SetupWizard({ onComplete }) {
  const [word, setWord] = useState(''); const [offset, setOffset] = useState(''); const [keys, setKeys] = useState([]);
  const validOffset = Number.isInteger(Number(offset)) && Number(offset) >= 10 && Number(offset) <= 99;

  return <div className="vp-theme flex flex-col gap-6">
    <div><p className="text-sm font-semibold text-[var(--vp-primary-hover)]">Set up Visual Password</p>
    <h3 className="mt-2 text-xl font-semibold text-[var(--vp-text-primary)]">Choose your secret</h3></div>
    <div><p className="mb-3 text-sm text-[var(--vp-text-secondary)]">Secret word</p>
    <WordSelect words={MOCK_WORDS} value={word} onChange={setWord} /></div>
    <label className="text-sm text-[var(--vp-text-secondary)]">Secret offset (10–99)<input type="number" min="10" max="99" value={offset} onChange={(event) => setOffset(event.target.value)} className="vp-input mt-2" />
    </label>
    <div><p className="mb-3 text-sm text-[var(--vp-text-secondary)]">Choose two position keys</p>
    <div className="grid grid-cols-5 gap-2">{POSITION_KEYS.map((key) => <button key={key} type="button" onClick={() => setKeys((current) => current.includes(key) ? current.filter((item) => item !== key) : current.length < 2 ? [...current, key] : current)} className={`rounded-xl border py-3 font-mono-data font-bold ${keys.includes(key) ? 'border-[var(--vp-primary)] bg-orange-50 text-[var(--vp-primary)]' : 'border-[var(--vp-border)] bg-white text-[var(--vp-text-primary)]'}`}>{key}</button>)}</div>
    </div><Button theme="light" fullWidth disabled={!word || !validOffset || keys.length !== 2} onClick={() => onComplete({ word, offset: Number(offset), positionKeys: keys })}>Save Visual Password</Button>
    </div>;
    
}


/* 'use client';

import { useMemo, useState } from 'react';
import { KeyRound, Hash, ShieldCheck, Info } from 'lucide-react';
import Button from '../ui/Button';
import ProgressStepper from './ProgressStepper';
import SummaryCard from './SummaryCard';
import WordSelect from './WordSelect';
import { MOCK_WORDS } from '@/lib/mockWords';

const SETUP_LABELS = ['Secret Word', 'Offset', 'Position Keys', 'Confirm'];
const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

/**
 * First-time-user Visual Password setup wizard: Secret Word -> Offset
 * -> Position Keys -> Confirmation. Purely local/mock state -- calling
 * `onComplete` just hands the chosen values back up; nothing is sent
 * to a backend here.
 *
 * @param {(credentials: { word: string, offset: number, positionKeys: [string, string] }) => void} onComplete
 */

/*
export default function SetupWizard({ onComplete }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [word, setWord] = useState('');
  const [offset, setOffset] = useState('');
  const [positionA, setPositionA] = useState('');
  const [positionB, setPositionB] = useState('');

  const offsetNumber = Number(offset);
  const offsetValid = offset !== '' && Number.isInteger(offsetNumber) && offsetNumber >= 10 && offsetNumber <= 99;
  const positionsValid = positionA !== '' && positionB !== '' && positionA !== positionB;

  const canContinue = useMemo(() => {
    switch (stepIndex) {
      case 0:
        return Boolean(word);
      case 1:
        return offsetValid;
      case 2:
        return positionsValid;
      default:
        return true;
    }
  }, [stepIndex, word, offsetValid, positionsValid]);

  const goNext = () => setStepIndex((i) => Math.min(i + 1, SETUP_LABELS.length - 1));
  const goBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  const handleSave = () => {
    onComplete?.({ word, offset: offsetNumber, positionKeys: [positionA, positionB] });
  };

  return (
    <div className="vp-theme flex flex-col gap-7">
      <div>
        <ProgressStepper labels={SETUP_LABELS} currentIndex={stepIndex} />
      </div>

      {stepIndex === 0 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            Create Visual Password &mdash; Secret Word
          </div>
          <p className="text-base text-[var(--vp-text-secondary)]">
            Choose one word you&apos;ll remember. It&apos;ll never be shown in full again -- only
            small fragments of it during verification.
          </p>
          <WordSelect words={MOCK_WORDS} value={word} onChange={setWord} />
        </div>
      )}

      {stepIndex === 1 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
            <Hash className="h-4 w-4" aria-hidden="true" />
            Offset
          </div>
          <p className="text-base text-[var(--vp-text-secondary)]">
            The offset is a private number that is added to every challenge value.
          </p>
          <input
            type="number"
            min={10}
            max={99}
            value={offset}
            onChange={(event) => setOffset(event.target.value)}
            placeholder="e.g. 42"
            className="vp-input max-w-[10rem] font-mono-data text-lg"
            autoComplete="off"
          />
          <p className="text-sm text-[var(--vp-text-secondary)]">Choose a number between 10 and 99.</p>
        </div>
      )}

      {stepIndex === 2 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Position Keys
          </div>
          <p className="text-base text-[var(--vp-text-secondary)]">
            Choose two different letters. During verification, you&apos;ll use these to tell us
            which digit is which -- without ever typing the number itself.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <select
              aria-label="First position key"
              value={positionA}
              onChange={(event) => setPositionA(event.target.value)}
              className="vp-input w-20 text-center font-mono-data text-lg font-semibold"
            >
              <option value="" disabled>
                &ndash;
              </option>
              {LETTERS.map((letter) => (
                <option key={letter} value={letter} disabled={letter === positionB}>
                  {letter}
                </option>
              ))}
            </select>
            <span className="text-lg font-semibold text-[var(--vp-text-muted)]">&amp;</span>
            <select
              aria-label="Second position key"
              value={positionB}
              onChange={(event) => setPositionB(event.target.value)}
              className="vp-input w-20 text-center font-mono-data text-lg font-semibold"
            >
              <option value="" disabled>
                &ndash;
              </option>
              {LETTERS.map((letter) => (
                <option key={letter} value={letter} disabled={letter === positionA}>
                  {letter}
                </option>
              ))}
            </select>
          </div>

          {positionsValid && (
            <div className="rounded-2xl border border-[var(--vp-border)] bg-[#fff9f0] px-4 py-3.5">
              <p className="text-sm font-medium text-[var(--vp-text-secondary)]">
                Selected Position Keys
              </p>
              <div className="mt-2 flex gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-mono-data text-lg font-bold text-[var(--vp-primary)] border border-[var(--vp-border)]">
                  {positionA}
                </span>
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white font-mono-data text-lg font-bold text-[var(--vp-primary)] border border-[var(--vp-border)]">
                  {positionB}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {stepIndex === 3 && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            Confirmation
          </div>
          <p className="text-base text-[var(--vp-text-secondary)]">
            Review your Visual Password before saving.
          </p>
          <SummaryCard
            rows={[
              { label: 'Word', value: word },
              { label: 'Offset', value: offsetNumber },
              { label: 'Position Keys', value: `${positionA}  ${positionB}` },
            ]}
          />
          <div className="flex gap-2.5 rounded-2xl border border-[var(--vp-border)] bg-[#fff9f0] px-4 py-3.5">
            <Info className="h-4 w-4 shrink-0 text-[var(--vp-secondary)] mt-0.5" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-[var(--vp-text-secondary)]">
              This is stored locally for this demo only -- no account or backend is involved yet.
            </p>
          </div>
        </div>
      )}

      <div className="flex gap-3">
        {stepIndex > 0 && (
          <Button theme="light" variant="secondary" fullWidth onClick={goBack}>
            Back
          </Button>
        )}
        {stepIndex < SETUP_LABELS.length - 1 ? (
          <Button theme="light" fullWidth disabled={!canContinue} onClick={goNext}>
            Continue
          </Button>
        ) : (
          <Button theme="light" fullWidth onClick={handleSave}>
            Save Visual Password
          </Button>
        )}
      </div>
    </div>
  );
}

*/