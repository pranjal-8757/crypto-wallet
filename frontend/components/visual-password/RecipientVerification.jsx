'use client';

import { useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import Button from '../ui/Button';
import { splitAddressTail } from '@/utils/recipientFormatter';

const CHAR_OPTIONS = [
  '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
  'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
];

/**
 * Stage 3 of transaction verification: highlights the last two
 * characters of the recipient address and asks the user to confirm
 * each one -- via dropdowns labeled with the user's own stored
 * Position Keys (e.g. "Dropdown P", "Dropdown G"), so a wrong-address
 * mistake is caught before signing.
 *
 * The first Position Key maps to the first highlighted character and
 * the second to the second, in order. Dropdown values are 0-9 and
 * A-Z per spec; matching is still mock/local for this pass.
 *
 * @param {string} address
 * @param {[string, string]} positionKeys - stored position keys, e.g. ["P", "G"]
 */
export default function RecipientVerification({
  address = '0xD3A74F95A8CE34B92A61FE9B7ACD49D58B4A92EF',
  positionKeys = ['P', 'G'],
  onContinue,
  onBack,
}) {
  const { body, tail } = useMemo(() => splitAddressTail(address, 2), [address]);
  const tailChars = useMemo(() => tail.split(''), [tail]);
  const [selections, setSelections] = useState({ 0: '', 1: '' });

  const allMatched = tailChars.every(
    (char, i) => selections[i]?.toUpperCase() === char.toUpperCase()
  );

  const [keyP, keyG] = positionKeys;
  const labels = [keyP, keyG];

  return (
    <div className="vp-theme flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
          <Wallet className="h-4 w-4" aria-hidden="true" />
          Recipient Verification
        </div>
        <p className="mt-2 text-base text-[var(--vp-text-secondary)]">
          Confirm the highlighted characters of the destination address using your Position Keys.
        </p>
      </div>

      <div className="vp-card px-6 py-6">
        <p className="text-sm text-[var(--vp-text-secondary)]">Wallet Address</p>
        <p className="mt-2 break-all font-mono-data text-lg text-[var(--vp-text-primary)]">
          {body}
          <span className="rounded-lg bg-orange-50 px-1.5 py-0.5 font-bold text-[var(--vp-primary)]">
            {tail}
          </span>
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[var(--vp-text-primary)]">Select Position Keys</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {tailChars.map((char, i) => (
            <div key={i}>
              <label
                htmlFor={`recipient-key-${i}`}
                className="mb-1.5 block text-sm text-[var(--vp-text-secondary)]"
              >
                Dropdown <span className="font-bold text-[var(--vp-primary)]">{labels[i]}</span>
              </label>
              <select
                id={`recipient-key-${i}`}
                className="vp-input font-mono-data text-base font-semibold"
                value={selections[i] ?? ''}
                onChange={(event) =>
                  setSelections((prev) => ({ ...prev, [i]: event.target.value }))
                }
              >
                <option value="" disabled>
                  Select a character
                </option>
                {CHAR_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <Button theme="light" variant="secondary" fullWidth onClick={onBack}>
          Back
        </Button>
        <Button theme="light" fullWidth disabled={!allMatched} onClick={onContinue}>
          Continue
        </Button>
      </div>
    </div>
  );
}