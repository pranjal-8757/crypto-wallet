'use client';

import { useState } from 'react';
import { Wallet } from 'lucide-react';
import Button from '../ui/Button';
import RegisterInputs from './RegisterInputs';

export default function RecipientVerification({ address, positionKeys, onContinue, onBack }) {
  const [register, setRegister] = useState({});
  const isComplete = positionKeys.every((key) => register[key] !== '' && register[key] !== undefined);
  return <div className="vp-theme flex flex-col gap-6"><div>
    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
      <Wallet className="h-4 w-4" />Recipient Verification</div>
      <p className="mt-2 text-base text-[var(--vp-text-secondary)]">Confirm the destination address with your five-position register.</p>
      </div>
      <div className="vp-card px-5 py-5">
        <p className="text-sm text-[var(--vp-text-secondary)]">Wallet Address</p>
        <p className="mt-2 break-all font-mono-data text-base text-[var(--vp-text-primary)]">{address}</p>
        </div>
        <RegisterInputs
          positionKeys={positionKeys}
          options={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']}
          onChange={setRegister} />
        <div className="flex gap-3">
          <Button theme="light" variant="secondary" fullWidth onClick={onBack}>Back</Button>
          <Button theme="light" fullWidth disabled={!isComplete} onClick={() => onContinue({ register })}>Continue</Button></div>
          </div>;
}
