'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  ShieldCheck,
  TrainFront,
  TreePine,
  Building2,
  Laptop,
  Cat,
  Milk,
  Home,
  Car,
  Bike,
  Umbrella,
  Camera,
  Clock,
  Anchor,
  Rocket,
  Gift,
  Music,
  Palette,
  Compass,
  Cloud,
  Sun,
  Moon,
  Star,
  Fish,
  Flower2,
} from 'lucide-react';
import Button from '../ui/Button';
import { useChallenge } from '@/hooks/useChallenge';

const MIN_SELECTION = 3;

// Presentational-only lookup: icon, label, and a display "challenge
// number" for each grid position. Purely cosmetic -- selection logic
// still comes entirely from useChallenge()'s `grid`/`selection` state.
const CARD_META = [
  { icon: TrainFront, label: 'Train', number: 35, tint: 'bg-sky-50 text-sky-500' },
  { icon: TreePine, label: 'Park', number: 20, tint: 'bg-emerald-50 text-emerald-500' },
  { icon: Building2, label: 'Hospital', number: 54, tint: 'bg-rose-50 text-rose-500' },
  { icon: Laptop, label: 'Laptop', number: 50, tint: 'bg-violet-50 text-violet-500' },
  { icon: Cat, label: 'Cat', number: 45, tint: 'bg-amber-50 text-amber-600' },
  { icon: Milk, label: 'Milk', number: 12, tint: 'bg-cyan-50 text-cyan-600' },
  { icon: Home, label: 'House', number: 63, tint: 'bg-orange-50 text-orange-500' },
  { icon: Car, label: 'Car', number: 78, tint: 'bg-indigo-50 text-indigo-500' },
  { icon: Bike, label: 'Bicycle', number: 29, tint: 'bg-lime-50 text-lime-600' },
  { icon: Umbrella, label: 'Umbrella', number: 41, tint: 'bg-blue-50 text-blue-500' },
  { icon: Camera, label: 'Camera', number: 56, tint: 'bg-fuchsia-50 text-fuchsia-500' },
  { icon: Clock, label: 'Clock', number: 88, tint: 'bg-teal-50 text-teal-600' },
  { icon: Anchor, label: 'Anchor', number: 17, tint: 'bg-slate-50 text-slate-500' },
  { icon: Rocket, label: 'Rocket', number: 64, tint: 'bg-red-50 text-red-500' },
  { icon: Gift, label: 'Gift', number: 33, tint: 'bg-pink-50 text-pink-500' },
  { icon: Music, label: 'Music', number: 72, tint: 'bg-purple-50 text-purple-500' },
  { icon: Palette, label: 'Palette', number: 25, tint: 'bg-yellow-50 text-yellow-600' },
  { icon: Compass, label: 'Compass', number: 90, tint: 'bg-emerald-50 text-emerald-600' },
  { icon: Cloud, label: 'Cloud', number: 48, tint: 'bg-sky-50 text-sky-600' },
  { icon: Sun, label: 'Sun', number: 61, tint: 'bg-amber-50 text-amber-500' },
  { icon: Moon, label: 'Moon', number: 15, tint: 'bg-indigo-50 text-indigo-600' },
  { icon: Star, label: 'Star', number: 83, tint: 'bg-orange-50 text-orange-600' },
  { icon: Fish, label: 'Fish', number: 37, tint: 'bg-cyan-50 text-cyan-500' },
  { icon: Flower2, label: 'Flower', number: 52, tint: 'bg-rose-50 text-rose-400' },
];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'Hindi' },
  { code: 'mr', label: 'Marathi' },
];

const LETTERS = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

/**
 * Represents the Visual Password SDK's core challenge screen: an
 * image grid the user taps in sequence to reproduce their pattern,
 * plus the supporting offset, position-key, and language controls
 * that make up a full Visual Password setup/verification screen.
 * This is OUR product, not Turnkey -- Turnkey never sees this step.
 *
 * The grid contents and verification logic are backend-owned; this
 * component only renders placeholders and tracks selection order
 * locally via useChallenge(). The offset/position-key/language
 * fields below are local, presentational-only state and do not gate
 * verification -- Continue is enabled purely by the existing grid
 * selection, exactly as before this redesign.
 */
export default function VisualPasswordChallenge({ onContinue }) {
  const { grid, selection, loading, start, toggleCell, hasSelection } = useChallenge();

  const [offset, setOffset] = useState('');
  const [positionA, setPositionA] = useState('');
  const [positionD, setPositionD] = useState('');
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    if (!grid) start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cards = useMemo(() => {
    if (!grid) return [];
    return grid.map((cell, i) => ({ ...cell, ...CARD_META[i % CARD_META.length] }));
  }, [grid]);

  const canContinue = selection.length >= MIN_SELECTION;

  return (
    <div className="vp-theme flex flex-col gap-7">
      <div>
        <div className="flex items-center gap-2 text-sm font-semibold text-[var(--vp-primary-hover)]">
          <ShieldCheck className="h-4 w-4" aria-hidden="true" />
          Visual Password Challenge
        </div>
        <p className="mt-2 text-base text-[var(--vp-text-secondary)]">
          Tap the images in your pattern, in order, to confirm it&apos;s really you.
        </p>
      </div>

      {loading || !grid ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="aspect-square animate-pulse-soft rounded-2xl bg-stone-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {cards.map((cell) => {
            const order = selection.indexOf(cell.id);
            const isSelected = order !== -1;
            const Icon = cell.icon;

            return (
              <button
                key={cell.id}
                type="button"
                onClick={() => toggleCell(cell.id)}
                aria-pressed={isSelected}
                aria-label={`${cell.label}, security value ${cell.number}${
                  isSelected ? `, selected as step ${order + 1}` : ''
                }`}
                className="vp-grid-card relative flex flex-col items-center gap-1.5 px-2 py-3.5 text-center"
              >
                {isSelected && (
                  <span className="absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[var(--vp-primary)] text-[11px] font-semibold text-white">
                    {order + 1}
                  </span>
                )}
                <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${cell.tint}`}>
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <span className="text-xs font-medium text-[var(--vp-text-primary)]">{cell.label}</span>
                <span className="font-mono-data text-[11px] text-[var(--vp-text-muted)]">{cell.number}</span>
              </button>
            );
          })}
        </div>
      )}

      <p className="text-sm text-[var(--vp-text-secondary)]">
        {hasSelection ? `${selection.length} selected` : `Select at least ${MIN_SELECTION} images`}
      </p>

      {/* Offset */}
      <div className="border-t border-[var(--vp-border)] pt-6">
        <label htmlFor="vp-offset" className="mb-1.5 block text-sm font-semibold text-[var(--vp-text-primary)]">
          Offset (10&ndash;99)
        </label>
        <input
          id="vp-offset"
          type="number"
          min={10}
          max={99}
          value={offset}
          onChange={(event) => setOffset(event.target.value)}
          placeholder="e.g. 42"
          className="vp-input font-mono-data max-w-[10rem]"
        />
        <p className="mt-2 text-sm text-[var(--vp-text-secondary)]">
          Age of a loved one, favourite jersey number, or any memorable number.
        </p>
      </div>

      {/* Position key selection */}
      <div>
        <p className="mb-2 text-sm font-semibold text-[var(--vp-text-primary)]">Position Key Selection</p>
        <div className="flex flex-wrap items-center gap-3">
          <select
            aria-label="First position key"
            value={positionA}
            onChange={(event) => setPositionA(event.target.value)}
            className="vp-input w-20 text-center font-mono-data"
          >
            <option value="" disabled>
              A
            </option>
            {LETTERS.map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>
          <span className="text-lg font-semibold text-[var(--vp-text-muted)]">+</span>
          <select
            aria-label="Second position key"
            value={positionD}
            onChange={(event) => setPositionD(event.target.value)}
            className="vp-input w-20 text-center font-mono-data"
          >
            <option value="" disabled>
              D
            </option>
            {LETTERS.map((letter) => (
              <option key={letter} value={letter}>
                {letter}
              </option>
            ))}
          </select>
        </div>
        <p className="mt-2 text-sm text-[var(--vp-text-secondary)]">Choose any two letters, A through Z.</p>
      </div>

      {/* Language */}
      <div>
        <p className="mb-2 text-sm font-semibold text-[var(--vp-text-primary)]">Language</p>
        <div className="vp-segment" role="radiogroup" aria-label="Language selection">
          {LANGUAGES.map((lang) => (
            <button
              key={lang.code}
              type="button"
              role="radio"
              aria-checked={language === lang.code}
              aria-pressed={language === lang.code}
              onClick={() => setLanguage(lang.code)}
              className="vp-segment-option"
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border border-[var(--vp-border)] bg-[#fff9f0] px-4 py-3.5">
        <p className="text-sm leading-relaxed text-[var(--vp-text-secondary)]">
          Your pattern never leaves this device unencrypted, and Vault never sees the images you
          chose during setup &mdash; only whether your selection matches.
        </p>
      </div>

      <Button theme="light" fullWidth disabled={!canContinue} onClick={onContinue}>
        Continue
      </Button>
    </div>
  );
}
