'use client';

import { Loader2 } from 'lucide-react';

const VARIANT_CLASSES = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  ghost: 'btn-ghost',
  danger: 'btn-danger',
};

const LIGHT_VARIANT_CLASSES = {
  primary: 'vp-btn-primary',
  secondary: 'vp-btn-secondary',
  ghost: 'vp-btn-ghost',
  danger: 'vp-btn-secondary',
};

const SIZE_CLASSES = {
  sm: 'text-sm px-3 py-1.5',
  md: 'text-sm px-5 py-2.5',
  lg: 'text-base px-6 py-3',
};

/**
 * Generic button used throughout the app.
 *
 * @param {'primary'|'secondary'|'ghost'|'danger'} variant
 * @param {'sm'|'md'|'lg'} size
 * @param {boolean} loading - shows a spinner and disables interaction
 * @param {boolean} fullWidth
 * @param {React.ReactNode} icon - optional icon rendered before the label
 * @param {'dark'|'light'} theme - 'dark' (default) is the standard
 *   dashboard look; 'light' is the warm white/orange treatment used
 *   only by the Visual Password verification/recovery flow.
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon = null,
  type = 'button',
  theme = 'dark',
  className = '',
  ...props
}) {
  const isLight = theme === 'light';
  const base = isLight ? 'vp-btn' : 'btn';
  const variantClass = isLight ? LIGHT_VARIANT_CLASSES[variant] : VARIANT_CLASSES[variant];
  const sizeClass = isLight ? '' : SIZE_CLASSES[size];

  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`${base} ${variantClass} ${sizeClass} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      {...props}
    >
      {loading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        icon
      )}
      <span>{children}</span>
    </button>
  );
}
