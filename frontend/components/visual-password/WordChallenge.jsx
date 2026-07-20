'use client';

import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import SetupWizard from './SetupWizard';
import VerificationWizard from './VerificationWizard';

// Mock stored credentials used whenever `hasVisualPassword` is true
// and no fresh setup happened in this session -- matches the example
// used throughout the spec (Word: chimney, Offset: 10, Position Keys:
// P/G).
const STORAGE_KEY = 'bankguard.visualPassword';

/**
 * Entry point for the Visual Password SDK's transaction-confirmation
 * flow. Opens after Send -> Continue, before Turnkey ever signs
 * anything.
 *
 * Two journeys, chosen by `hasVisualPassword`:
 *  - First-time user (false): SetupWizard (Word -> Offset -> Position
 *    Keys -> Confirm), then immediately continues into verification
 *    using the credentials just entered, so the whole flow can be
 *    exercised in one sitting.
 *  - Returning user (true): straight into VerificationWizard using
 *    the mock stored credentials above.
 *
 * Everything here is local/mock state -- no backend, no API calls.
 *
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {{ recipient: string, amount: string, symbol: string, network: string }} transaction
 * @param {(transaction: object) => void} onVerified
 * @param {boolean} hasVisualPassword - simulates whether this user has
 *   already configured a Visual Password. Toggle this to exercise
 *   either journey.
 */
export default function VisualPasswordModal({
  open,
  onClose,
  transaction,
  onVerified,
  hasVisualPassword = false,
}) {
  const [configured, setConfigured] = useState(false);
  const [credentials, setCredentials] = useState(null);

  // Reset back to the initial journey every time the modal is reopened.
  useEffect(() => {
    if (!open) return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    try {
      const parsed = stored ? JSON.parse(stored) : null;
      setConfigured(Boolean(parsed?.word && parsed?.offset && Array.isArray(parsed?.positionKeys)));
      setCredentials(parsed);
    } catch { setConfigured(false); setCredentials(null); }
  }, [open, hasVisualPassword]);

  const handleClose = () => {
    onClose?.();
  };

  const handleSetupComplete = (newCredentials) => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newCredentials));
    setCredentials(newCredentials);
    setConfigured(true);
  };

  const handleVerified = (verification) => {
    onVerified?.({ ...transaction, verification });
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Visual Password"
      theme="light"
      maxWidth="2xl"
    >
      {configured && credentials ? (
        <VerificationWizard
          credentials={credentials}
          transaction={transaction}
          onVerified={handleVerified}
          onCancel={handleClose}
        />
      ) : (
        <SetupWizard onComplete={handleSetupComplete} />
      )}
    </Modal>
  );
}


/*'use client';

import { useMemo, useState } from 'react';
import { ShieldCheck, Info } from 'lucide-react';
import Button from '../ui/Button';

const DIGIT_OPTIONS = Array.from({ length: 10 }, (_, i) => String(i));
*/
/**
 * Randomly reveals a contiguous slice of `word` (prefix, middle, or
 * suffix) and masks the rest with underscores -- e.g. "chimney" ->
 * "chi____", "___mn__", or "_____ey".
 */
/*
function maskWord(word) {
  const len = word.length;
  const mode = ['prefix', 'middle', 'suffix'][Math.floor(Math.random() * 3)];

  let revealLen;
  let start;

  if (mode === 'prefix') {
    revealLen = Math.min(3, Math.max(1, Math.round(len * 0.4)));
    start = 0;
  } else if (mode === 'suffix') {
    revealLen = Math.min(2, Math.max(1, Math.round(len * 0.3)));
    start = len - revealLen;
  } else {
    revealLen = Math.min(2, Math.max(1, Math.round(len * 0.3)));
    start = Math.floor((len - revealLen) / 2);
  }

  return word
    .split('')
    .map((char, i) => (i >= start && i < start + revealLen ? char : '_'))
    .join('');
}

/**
 * Picks a random challenge number (1-9) small enough that
 * `offset + challenge` always stays a two-digit sum (offset is
 * 10-99), so the "computed value" always maps cleanly onto exactly
 * two Position Key digits.
 */
/*

/*function pickChallengeNumber(offset) {
  const maxChallenge = Math.max(1, Math.min(9, 99 - offset));
  return 1 + Math.floor(Math.random() * maxChallenge);
}

/**
 * Stage 1 of transaction verification: Visual Password Challenge.
 *
 * The backend (mocked here) reveals one masked fragment of the
 * user's stored secret word plus a random 1-9 "displayed value". The
 * user mentally adds their private offset to that value, then --
 * per the current spec -- does NOT type the sum directly. Instead the
 * two resulting digits are assigned to the user's two Position Keys,
 * in EITHER order, and picked from two 0-9 dropdowns (no free text).
 * The backend compares the two entered digits against the expected
 * pair as an unordered set, e.g. for a computed value of 18:
 *   P=1, G=8  -> valid
 *   P=8, G=1  -> valid (order doesn't matter)
 *   P=1, G=7  -> invalid
 *
 * All of this is mock/local state for now -- real challenge
 * generation and pair validation are backend concerns for Part 2.
 *
 * @param {string} word - stored secret word, e.g. "chimney"
 * @param {number} offset - stored secret offset, 10-99
 * @param {[string, string]} positionKeys - stored position keys, e.g. ["P", "G"]
 * @param {() => void} onContinue
 */
/*

/&* port default function WordChallenge({ word = 'chimney', offset = 10, positionKeys = ['P', 'G'], onContinue }) {
  const [challenge] = useState(() => ({
    masked: maskWord(word),
    value: pickChallengeNumber(offset),
  }));

  const [selP, setSelP] = useState('');
  const [selG, setSelG] = useState('');

  const expectedDigits = useMemo(() => {
    const sum = offset + challenge.value;
    return [Math.floor(sum / 10), sum % 10];
  }, [offset, challenge.value]);

  const isCorrect = useMemo(() => {
    if (selP === '' || selG === '') return false;
    const entered = [Number(selP), Number(selG)].sort();
    const expected = [...expectedDigits].sort();
    return entered[0] === expected[0] && entered[1] === expected[1];
  }, [selP, selG, expectedDigits]);

  const [keyP, keyG] = positionKeys;

  return (
    <div className="vp-theme flex flex-col gap-6">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Visual Password Challenge
        </div>
        <p className="mt-2 text-base text-[var(--vp-text-secondary)]">
          This confirms you know your secret word and offset -- without ever showing either one on
          screen.
        </p>
      </div>

      <div className="vp-card px-6 py-6 text-center">
        <p className="text-sm text-[var(--vp-text-secondary)]">Masked Word Fragment</p>
        <p className="mt-1.5 font-mono-data text-3xl font-bold tracking-[0.2em] text-[var(--vp-text-primary)]">
          {challenge.masked}
        </p>
        <div className="mt-5 border-t border-[var(--vp-border)] pt-5">
          <p className="text-sm text-[var(--vp-text-secondary)]">Displayed Value</p>
          <p className="mt-1.5 font-mono-data text-4xl font-bold text-[var(--vp-primary)]">
            {challenge.value}
          </p>
        </div>
      </div>

      <div className="flex gap-2.5 rounded-2xl border border-[var(--vp-border)] bg-[#fff9f0] px-4 py-3.5">
        <Info className="h-4 w-4 shrink-0 text-[var(--vp-secondary)] mt-0.5" aria-hidden="true" />
        <p className="text-sm leading-relaxed text-[var(--vp-text-secondary)]">
          Add your secret offset to the displayed value above. Then assign the two resulting
          digits to your Position Keys below, in either order.
        </p>
      </div>

      <div>
        <p className="mb-3 text-sm font-semibold text-[var(--vp-text-primary)]">
          Assign digits to your Position Keys
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="vp-key-p" className="mb-1.5 block text-sm text-[var(--vp-text-secondary)]">
              Dropdown <span className="font-bold text-[var(--vp-primary)]">{keyP}</span>
            </label>
            <select
              id="vp-key-p"
              value={selP}
              onChange={(event) => setSelP(event.target.value)}
              className="vp-input font-mono-data text-center text-lg font-semibold"
            >
              <option value="" disabled>
                Select a digit
              </option>
              {DIGIT_OPTIONS.map((digit) => (
                <option key={digit} value={digit}>
                  {digit}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="vp-key-g" className="mb-1.5 block text-sm text-[var(--vp-text-secondary)]">
              Dropdown <span className="font-bold text-[var(--vp-primary)]">{keyG}</span>
            </label>
            <select
              id="vp-key-g"
              value={selG}
              onChange={(event) => setSelG(event.target.value)}
              className="vp-input font-mono-data text-center text-lg font-semibold"
            >
              <option value="" disabled>
                Select a digit
              </option>
              {DIGIT_OPTIONS.map((digit) => (
                <option key={digit} value={digit}>
                  {digit}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mt-2 text-sm text-[var(--vp-text-secondary)]">
          Order doesn&apos;t matter -- either digit can go under either key.
        </p>
      </div>

      <Button theme="light" fullWidth disabled={!isCorrect} onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}
  */