import Card from '../ui/Card';

/**
 * Consistent header + body wrapper used by every section on the
 * Settings page, so each section only needs to supply its own
 * content.
 *
 * @param {React.ElementType} icon
 * @param {string} title
 * @param {string} description
 * @param {'default'|'danger'} tone - 'danger' styles the section for
 *   destructive settings (Danger Zone)
 */
export default function SettingsSection({ icon: Icon, title, description, tone = 'default', children }) {
  return (
    <Card
      padding="lg"
      className={tone === 'danger' ? 'border-danger/30' : ''}
    >
      <div className="flex items-start gap-3">
        {Icon && (
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md border ${
              tone === 'danger'
                ? 'bg-danger/10 border-danger/20 text-danger'
                : 'bg-primary/10 border-primary/20 text-primary-hover'
            }`}
          >
            <Icon className="h-4.5 w-4.5" aria-hidden="true" />
          </div>
        )}
        <div>
          <h2 className="text-base font-semibold text-text-primary">{title}</h2>
          {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-4">{children}</div>
    </Card>
  );
}
