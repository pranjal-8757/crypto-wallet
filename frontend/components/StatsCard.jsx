import Card from './ui/Card';

const TREND_CLASSES = {
  up: 'text-success',
  down: 'text-danger',
  flat: 'text-text-secondary',
};

/**
 * Small stat display: an icon, a label, a value, and an optional
 * trend/delta line. Used for dashboard quick stats and asset rows.
 *
 * @param {React.ElementType} icon - lucide-react icon component
 * @param {string} label
 * @param {string} value
 * @param {string} delta - optional trend text, e.g. "+2.4%"
 * @param {'up'|'down'|'flat'} trend
 */
export default function StatsCard({ icon: Icon, label, value, delta, trend = 'flat' }) {
  return (
    <Card padding="md">
      <div className="flex items-center justify-between">
        <p className="text-sm text-text-secondary">{label}</p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-card-hover">
            <Icon className="h-4 w-4 text-text-secondary" aria-hidden="true" />
          </div>
        )}
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-text-primary font-mono-data">
        {value}
      </p>
      {delta && (
        <p className={`mt-1 text-xs font-medium ${TREND_CLASSES[trend]}`}>{delta}</p>
      )}
    </Card>
  );
}
