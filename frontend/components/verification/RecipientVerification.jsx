'use client';

import { useMemo, useState } from 'react';
import { Wallet } from 'lucide-react';
import Button from '../ui/Button';
import { splitAddressTail, getTailPositions } from '@/utils/recipientFormatter';

const HEX_OPTIONS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

/**
 * Third verification step, crypto-only: highlights the last N
 * characters of the recipient address and asks the user to confirm
 * each one via a dropdown, so a wrong-address mistake is caught
 * before signing.
 *
 * Which positions get highlighted is a backend decision in
 * production (see utils/recipientFormatter.js ->
 * getRecipientVerificationPositions()). Here it's fixed to the last 2
 * characters for demonstration.
 *
 * @param {string} address
 */
export default function RecipientVerification({
  address = '0xD3A74F95A8CE34B92A61FE9B7ACD49D58B4A92EF',
  onContinue,
  onBack,
}) {
  const { body, tail } = useMemo(() => splitAddressTail(address, 2), [address]);
  const positions = useMemo(() => getTailPositions(tail), [tail]);
  const [selections, setSelections] = useState({});

  const allMatched = positions.every((p) => selections[p.index] === p.char);

  return (
    <div className="vp-theme flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
          <Wallet className="h-4 w-4" aria-hidden="true" />
          Recipient Verification
        </div>
        <p className="mt-2 text-base text-[var(--vp-text-secondary)]">
          Confirm the highlighted characters of the destination address.
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
          {positions.map((p) => (
            <div key={p.index}>
              <label
                htmlFor={`position-key-${p.index}`}
                className="mb-1.5 block text-sm text-[var(--vp-text-secondary)]"
              >
                Position Key for <span className="font-bold text-[var(--vp-primary)]">{p.char}</span>
              </label>
              <select
                id={`position-key-${p.index}`}
                className="vp-input font-mono-data text-base font-semibold"
                value={selections[p.index] ?? ''}
                onChange={(event) =>
                  setSelections((prev) => ({ ...prev, [p.index]: event.target.value }))
                }
              >
                <option value="" disabled>
                  Select a character
                </option>
                {HEX_OPTIONS.map((option) => (
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
