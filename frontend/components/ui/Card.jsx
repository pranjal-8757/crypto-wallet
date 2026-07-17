/**
 * Base surface used for panels, list rows, and grouped content.
 *
 * @param {boolean} interactive - adds hover lift/border treatment for
 *   cards that act like clickable/tappable elements.
 * @param {boolean} glass - uses the translucent glass treatment instead
 *   of the solid card background. Reserve for floating/elevated panels.
 * @param {'none'|'sm'|'md'|'lg'} padding
 * @param {'dark'|'light'} theme - 'dark' (default) is the standard
 *   dashboard look; 'light' is the warm white/orange treatment used
 *   only by the Visual Password verification/recovery flow.
 */
export default function Card({
  children,
  interactive = false,
  glass = false,
  padding = 'md',
  theme = 'dark',
  className = '',
  ...props
}) {
  const paddingClasses = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const isLight = theme === 'light';
  const surfaceClass = isLight ? 'vp-card' : glass ? 'surface-glass' : 'surface-card';
  const interactiveClass = interactive ? (isLight ? 'vp-card--interactive' : 'surface-card--interactive') : '';
  const radiusClass = isLight ? '' : 'rounded-lg';

  return (
    <div
      className={`${surfaceClass} ${interactiveClass} ${radiusClass} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
