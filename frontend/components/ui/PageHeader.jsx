/**
 * Standard header used at the top of every app page: a title, optional
 * supporting description, and a right-aligned slot for actions
 * (e.g. a primary Button).
 */
export default function PageHeader({ title, description, actions = null, className = '' }) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8 ${className}`}
    >
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-text-primary">{title}</h1>
        {description && (
          <p className="mt-1.5 text-sm text-text-secondary max-w-2xl">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  );
}
