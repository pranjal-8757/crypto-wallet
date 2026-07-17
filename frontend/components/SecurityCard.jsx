import { ShieldCheck, ShieldAlert } from 'lucide-react';
import Card from './ui/Card';
import Badge from './ui/Badge';

/**
 * Summarizes the account's security posture: passkey status, Visual
 * Password configuration, and recovery method.
 *
 * @param {{passkey: object, visualPassword: object, recoveryMethod: object}} status
 */
export default function SecurityCard({ status }) {
  const rows = [status.passkey, status.recoveryMethod, status.visualPassword];

  return (
    <Card padding="lg">
      <div className="flex items-center gap-2.5">
        <ShieldCheck className="h-4.5 w-4.5 text-primary-hover" aria-hidden="true" />
        <h3 className="text-base font-semibold text-text-primary">Security Status</h3>
      </div>

      <ul className="mt-5 flex flex-col gap-4">
        {rows.map((row) => (
          <li key={row.label} className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {row.active ? (
                <ShieldCheck className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              ) : (
                <ShieldAlert className="h-4 w-4 shrink-0 text-warning" aria-hidden="true" />
              )}
              <div className="min-w-0">
                <p className="text-sm text-text-primary">{row.label}</p>
                {!row.active && row.note && (
                  <p className="text-xs text-text-secondary">{row.note}</p>
                )}
              </div>
            </div>
            <Badge tone={row.active ? 'success' : 'warning'}>
              {row.active ? 'Active' : 'Pending'}
            </Badge>
          </li>
        ))}
      </ul>
    </Card>
  );
}
