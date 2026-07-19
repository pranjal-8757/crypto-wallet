'use client';

/**
 * components/visual-password/WordSelect.jsx
 *
 * Renders `words` as a responsive grid of tappable chips so the user
 * can pick their Secret Word, matching the same selected/hover
 * treatment used by the image grid in
 * components/verification/VisualPasswordChallenge.jsx (`vp-grid-card`,
 * `aria-pressed`).
 *
 * @param {string[]} words
 * @param {string} value - currently selected word
 * @param {(next: string) => void} onChange
 */
export default function WordSelect({ words, value, onChange }) {
  return (
    <div
      className="grid grid-cols-2 gap-3 sm:grid-cols-3"
      role="radiogroup"
      aria-label="Secret word options"
    >
      {words.map((word) => {
        const isSelected = word === value;

        return (
          <button
            key={word}
            type="button"
            role="radio"
            aria-checked={isSelected}
            aria-pressed={isSelected}
            onClick={() => onChange(word)}
            className="vp-grid-card px-4 py-3 text-center font-mono-data text-sm font-semibold capitalize text-[var(--vp-text-primary)]"
          >
            {word}
          </button>
        );
      })}
    </div>
  );
}