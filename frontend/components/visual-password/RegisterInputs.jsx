'use client';

import { useMemo, useState } from 'react';

export const POSITION_KEYS = ['J', 'C', 'A', 'P', 'W'];

export default function RegisterInputs({ onChange }) {
  const [values, setValues] = useState(Array(5).fill(''));
  const counts = useMemo(() => values.reduce((result, value) => value === '' ? result : { ...result, [value]: (result[value] || 0) + 1 }, {}), [values]);
  const setValue = (index, value) => {
    const next = values.map((current, currentIndex) => currentIndex === index ? value : current);
    setValues(next);
    onChange?.(next);
  };

  return <div className="grid grid-cols-5 gap-2" aria-label="Five-position register">{POSITION_KEYS.map((key, index) => {
    const current = values[index];
    return <label key={key} className="text-center"><span className="mb-2 block rounded-xl border border-[var(--vp-border)] bg-[#faf9f6] py-2 font-mono-data font-bold text-[var(--vp-text-primary)]">{key}</span><select value={current} disabled={index > 0 && !values[index - 1]} onChange={(event) => setValue(index, event.target.value)} aria-label={`Digit for position ${key}`} className="vp-input h-16 p-0 text-center font-mono-data text-2xl font-bold"><option value="">·</option>{Array.from({ length: 10 }, (_, digit) => { const value = String(digit); const usedElsewhere = (counts[value] || 0) - (current === value ? 1 : 0); return usedElsewhere >= 2 && current !== value ? null : <option key={digit} value={value}>{digit}</option>; })}</select></label>;
  })}</div>;
}
