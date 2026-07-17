/**
 * Placeholder shown when a list or page has nothing to display yet.
 * Treats emptiness as an invitation to act: pair with a clear next step.
 *
 * @param {React.ReactNode} icon
 * @param {string} title
 * @param {string} description
 * @param {React.ReactNode} action - optional Button prompting the next step
 */
export default function EmptyState({ icon = null, title, description, action = null }) {
  return (
    <div className="grid-motif flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border px-6 py-16 text-center">
      {icon && (
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card border border-border text-text-secondary">
          {icon}
        </div>
      )}
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      {description && (
        <p className="max-w-sm text-sm text-text-secondary">{description}</p>
      )}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
