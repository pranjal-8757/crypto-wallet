'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';

const MAX_WIDTH_CLASSES = {
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-3xl',
};

/**
 * Accessible modal dialog. Closes on Escape or backdrop click.
 *
 * @param {boolean} open
 * @param {() => void} onClose
 * @param {string} title
 * @param {'dark'|'light'} theme - 'dark' (default) is the standard
 *   dashboard look; 'light' is the warm white/orange treatment used
 *   only by the Visual Password verification/recovery flow.
 * @param {'md'|'lg'|'xl'|'2xl'} maxWidth
 */
export default function Modal({
  open,
  onClose,
  title,
  children,
  footer = null,
  theme = 'dark',
  maxWidth = 'md',
}) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose?.();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const isLight = theme === 'light';

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isLight ? 'vp-theme' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 animate-fade-up backdrop-blur-sm ${
          isLight ? 'bg-stone-900/40' : 'bg-black/70'
        }`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        className={`relative w-full ${MAX_WIDTH_CLASSES[maxWidth]} max-h-[90vh] overflow-y-auto animate-fade-up ${
          isLight ? 'vp-card' : 'surface-card surface-glass rounded-lg'
        } shadow-lg`}
      >
        <div
          className={`flex items-center justify-between px-6 py-4 border-b sticky top-0 z-10 ${
            isLight ? 'border-[var(--vp-border)] bg-white/95 backdrop-blur-sm' : 'border-border bg-card'
          }`}
        >
          <h2
            id="modal-title"
            className={`text-lg font-semibold ${isLight ? 'text-[var(--vp-text-primary)]' : 'text-text-primary'}`}
          >
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className={`rounded-full p-1.5 transition-colors ${
              isLight
                ? 'text-[var(--vp-text-secondary)] hover:text-[var(--vp-text-primary)] hover:bg-stone-100'
                : 'text-text-secondary hover:text-text-primary hover:bg-card-hover'
            }`}
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className={`px-6 py-5 text-sm ${isLight ? 'text-[var(--vp-text-secondary)]' : 'text-text-secondary'}`}>
          {children}
        </div>

        {footer && (
          <div
            className={`flex items-center justify-end gap-3 px-6 py-4 border-t sticky bottom-0 ${
              isLight ? 'border-[var(--vp-border)] bg-white/95' : 'border-border'
            }`}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
