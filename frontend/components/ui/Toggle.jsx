'use client';

/**
 * Accessible on/off switch. Fully controlled -- callers own the
 * checked state via `checked` + `onChange`.
 *
 * @param {boolean} checked
 * @param {(next: boolean) => void} onChange
 * @param {string} label - accessible name (visually hidden if no
 *   visible label is rendered alongside)
 */
export default function Toggle({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border transition-colors ${
        checked ? 'bg-primary border-primary' : 'bg-card-hover border-border'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      <span
        className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform ${
          checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
        }`}
      />
    </button>
  );
}
