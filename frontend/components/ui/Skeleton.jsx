/**
 * Animated placeholder block used while real content loads.
 *
 * @param {string} width - CSS width value (defaults to full width)
 * @param {string} height - CSS height value
 * @param {'sm'|'md'|'lg'|'full'} radius
 */
export default function Skeleton({ width = '100%', height = '1rem', radius = 'sm', className = '' }) {
  const radiusClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={`animate-pulse-soft bg-card-hover ${radiusClasses[radius]} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  );
}
