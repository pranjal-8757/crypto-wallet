'use client';

import { useEffect, useState } from 'react';
import Modal from '../ui/Modal';
import SetupWizard from './SetupWizard';
import VerificationWizard from './VerificationWizard';

// Mock stored credentials used whenever `hasVisualPassword` is true
// and no fresh setup happened in this session -- matches the example
// used throughout the spec (Word: chimney, Offset: 10, Position Keys:
// P/G).
const MOCK_STORED_CREDENTIALS = {
  word: 'chimney',
  offset: 10,
  positionKeys: ['P', 'G'],
};

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
  const [configured, setConfigured] = useState(hasVisualPassword);
  const [credentials, setCredentials] = useState(
    hasVisualPassword ? MOCK_STORED_CREDENTIALS : null
  );

  // Reset back to the initial journey every time the modal is reopened.
  useEffect(() => {
    if (!open) return;
    setConfigured(hasVisualPassword);
    setCredentials(hasVisualPassword ? MOCK_STORED_CREDENTIALS : null);
  }, [open, hasVisualPassword]);

  const handleClose = () => {
    onClose?.();
  };

  const handleSetupComplete = (newCredentials) => {
    setCredentials(newCredentials);
    setConfigured(true);
  };

  const handleVerified = () => {
    onVerified?.(transaction);
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