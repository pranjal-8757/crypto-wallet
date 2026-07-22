'use client';

import { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import Button from '../ui/Button';
import RegisterInputs from './RegisterInputs';

const DECOY_WORDS = ['rocket', 'forest', 'planet', 'shadow', 'harvest', 'copper', 'window', 'marble'];

function maskWord(word) {
  const start = Math.max(0, Math.floor(word.length / 2) - 1);
  return word
    .split('')
    .map((letter, index) => (index >= start && index < start + 2 ? letter : '_'))
    .join('');
}

function createChallenge(word, offset, challengeValue) {
  const maximumValue = Math.max(1, Math.min(9, 99 - offset));
  const secretValue = challengeValue ?? 1 + Math.floor(Math.random() * maximumValue);
  const cards = [
    { mask: maskWord(word), value: secretValue, secret: true },
    ...DECOY_WORDS.map((decoy, index) => ({
      mask: maskWord(decoy),
      value: ((index + secretValue + 2) % 9) + 1,
      secret: false,
    })),
  ];

  return cards.sort(() => Math.random() - 0.5);
}

export default function WordChallenge({ word, offset, positionKeys, challengeValue, onContinue }) {
  console.log("Position Keys received:", positionKeys);
  const [register, setRegister] = useState({});
  const safeOffset = Number(offset);
  const challenge = useMemo(
    () => createChallenge(word, Number.isInteger(safeOffset) ? safeOffset : 10, challengeValue),
    [word, safeOffset, challengeValue]
  );
  const secretCard = challenge.find((card) => card.secret);
  const expectedDigits = String(safeOffset + secretCard.value).padStart(2, '0');

  const enteredDigits = positionKeys.map((key) => register[key]);
  const registerValues = Object.values(register);
  const isComplete = registerValues.length === 5 && registerValues.every((value) => value !== '');
  const isValid = isComplete && enteredDigits.every((digit, index) => digit === expectedDigits[index]);

  return (
    <div className="vp-theme flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Visual Password
        </div>
        <p className="mt-2 text-base text-[var(--vp-text-secondary)]">
          Find your word, then complete your register row.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3" aria-label="Visual Password word challenge">
        {challenge.map((card, index) => (
          <div
            key={`${card.mask}-${index}`}
            className="vp-card flex min-h-28 flex-col items-center justify-center text-center"
          >
            <p className="font-mono-data text-xl font-bold tracking-wider text-[var(--vp-text-primary)]">
              {card.mask}
            </p>
            <p className="mt-2 font-mono-data text-3xl font-bold text-[var(--vp-primary)]">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <RegisterInputs positionKeys={positionKeys} onChange={setRegister} />

      <Button theme="light" fullWidth disabled={!isValid} onClick={() => onContinue({ register })}>
        Authorize payment
      </Button>
      <p className="text-center text-sm text-[var(--vp-text-secondary)]">
        This step confirms it&apos;s really you — never share these values.
      </p>
    </div>
  );
}
