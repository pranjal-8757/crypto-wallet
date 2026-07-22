'use client';

import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import SetupWizard from './SetupWizard';
import VerificationWizard from './VerificationWizard';
import { authenticatedFetch } from '@/lib/auth';

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
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      try {
        const parsed = stored ? JSON.parse(stored) : null;
        setConfigured(Boolean(parsed?.word && parsed?.offset && Array.isArray(parsed?.positionKeys)));
        setCredentials(parsed);
      } catch { setConfigured(false); setCredentials(null); }
    }, 0);
    return () => window.clearTimeout(timer);
  }, [open, hasVisualPassword]);

  const handleClose = () => {
    onClose?.();
  };

  const handleSetupComplete = async (newCredentials) => {
    const response = await authenticatedFetch('/v1/setup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        secretWord: newCredentials.word,
        offset: newCredentials.offset,
        positionKeys: newCredentials.positionKeys,
      }),
    });
    if (!response.ok) throw new Error((await response.json().catch(() => ({}))).message || 'Unable to save Visual Password.');
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
