'use client';

import { useState } from 'react';
import Button from '../ui/Button';
import WordSelect from './WordSelect';
import { MOCK_WORDS } from '@/lib/mockWords';
//import { POSITION_KEYS } from './RegisterInputs';

const LETTERS = Array.from(
    { length: 26 },
    (_, i) => String.fromCharCode(65 + i)
);
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
    <div className="grid grid-cols-5 gap-2">{LETTERS.map((key) => <button key={key} type="button" onClick={() => setKeys((current) => current.includes(key) ? current.filter((item) => item !== key) : current.length < 2 ? [...current, key] : current)} className={`rounded-xl border py-3 font-mono-data font-bold ${keys.includes(key) ? 'border-[var(--vp-primary)] bg-orange-50 text-[var(--vp-primary)]' : 'border-[var(--vp-border)] bg-white text-[var(--vp-text-primary)]'}`}>{key}</button>)}</div>
    </div><Button theme="light" fullWidth disabled={!word || !validOffset || keys.length !== 2} onClick={() => onComplete({ word, offset: Number(offset), positionKeys: keys })}>Save Visual Password</Button>
    </div>;
    
}

