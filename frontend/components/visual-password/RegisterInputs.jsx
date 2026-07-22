'use client';

import { useMemo, useState } from 'react';
import generateRegister from './generateRegister';

export default function RegisterInputs({ positionKeys, onChange, options = Array.from({ length: 10 }, (_, digit) => String(digit)) }) {
  const [register] = useState(() => generateRegister(positionKeys));
  const [values, setValues] = useState(() => Object.fromEntries(register.map((key) => [key, ''])));

  const counts = useMemo(
    () =>
      register.reduce((result, key) => {
        const value = values[key];
        return value === '' || value === undefined ? result : { ...result, [value]: (result[value] || 0) + 1 };
      }, {}),
    [values, register]
  );

  const setValue = (key, value) => {
    const next = { ...values, [key]: value };
    setValues(next);
    onChange?.(next);
  };

  return (
    <div className="grid grid-cols-5 gap-2" aria-label="Five-position register">
      {register.map((key, index) => {
        const current = values[key];
        const previousKey = register[index - 1];
        return (
          <label key={key} className="text-center">
            <span className="mb-2 block rounded-xl border border-[var(--vp-border)] bg-[#faf9f6] py-2 font-mono-data font-bold text-[var(--vp-text-primary)]">
              {key}
            </span>
            <select
              value={current}
              disabled={false}
              onChange={(event) => setValue(key, event.target.value)}
              aria-label={`Digit for position ${key}`}
              className="vp-input h-16 p-0 text-center font-mono-data text-2xl font-bold"
            >
              <option value="">·</option>
              {options.map((value) => {
                const usedElsewhere = (counts[value] || 0) - (current === value ? 1 : 0);
                return usedElsewhere >= 2 && current !== value ? null : (
                  <option key={value} value={value}>
                    {value}
                  </option>
                );
              })}
            </select>
          </label>
        );
      })}
    </div>
  );
}
