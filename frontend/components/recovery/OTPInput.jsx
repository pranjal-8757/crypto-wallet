'use client';

import { useRef } from 'react';
import { KeyRound } from 'lucide-react';
import Button from '../ui/Button';

const LENGTH = 6;

/**
 * One-time code entry: six individual digit boxes that combine into a
 * single OTP string via `onChange`. Rendered in the Visual Password
 * SDK's warm white/orange theme.
 *
 * @param {string} value
 * @param {(next: string) => void} onChange
 * @param {'idle'|'verifying'|'failed'} status
 */
export default function OTPInput({ value, onChange, onContinue, onBack, status = 'idle' }) {
  const inputsRef = useRef([]);
  const digits = value.padEnd(LENGTH, ' ').split('').slice(0, LENGTH);

  const setDigit = (index, char) => {
    const next = digits.slice();
    next[index] = char;
    onChange(next.join('').trimEnd());
  };

  const handleChange = (index, event) => {
    const char = event.target.value.replace(/[^0-9]/g, '').slice(-1);
    setDigit(index, char || ' ');
    if (char && index < LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index].trim() && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
          <KeyRound className="h-4 w-4" aria-hidden="true" />
          Verify your code
        </div>
        <p className="mt-2 text-base text-[var(--vp-text-secondary)]">
          Enter the 6-digit code we sent to your email.
        </p>
      </div>

      <div className="flex justify-between gap-2">
        {digits.map((digit, i) => (
          <input
            key={i}
            ref={(el) => (inputsRef.current[i] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit.trim()}
            onChange={(event) => handleChange(i, event)}
            onKeyDown={(event) => handleKeyDown(i, event)}
            className="vp-input h-14 w-full text-center font-mono-data text-xl font-semibold"
            aria-label={`Digit ${i + 1} of ${LENGTH}`}
          />
        ))}
      </div>

      {status === 'failed' && (
        <p className="text-sm font-medium text-red-500">That code didn&apos;t match. Please try again.</p>
      )}

      <div className="flex gap-3">
        <Button theme="light" variant="secondary" fullWidth onClick={onBack}>
          Back
        </Button>
        <Button
          theme="light"
          fullWidth
          loading={status === 'verifying'}
          disabled={value.length !== LENGTH}
          onClick={onContinue}
        >
          Verify Code
        </Button>
      </div>
    </div>
  );
}
