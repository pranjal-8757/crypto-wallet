/**
 * Centers and constrains page content to a consistent max width with
 * responsive horizontal padding.
 *
 * @param {'sm'|'md'|'lg'|'xl'} size - controls max-width breakpoint
 */
export default function Container({ children, size = 'lg', className = '' }) {
  const sizeClasses = {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  };

  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 ${sizeClasses[size]} ${className}`}>
      {children}
    </div>
  );
}
