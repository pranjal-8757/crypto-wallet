/**
 * Read-only label/value rows in a `.vp-card` shell -- used by the
 * setup Confirmation step (Word/Offset/Position Keys) and can be
 * reused anywhere else a short summary is needed in the Visual
 * Password flow.
 *
 * @param {{ label: string, value: React.ReactNode }[]} rows
 */
export default function SummaryCard({ rows }) {
  return (
    <div className="vp-card divide-y divide-[var(--vp-border)] px-5">
      {rows.map(({ label, value }) => (
        <div key={label} className="flex items-center justify-between gap-3 py-4">
          <span className="text-sm text-[var(--vp-text-secondary)]">{label}</span>
          <span className="font-mono-data text-sm font-semibold text-[var(--vp-text-primary)]">
            {value}
          </span>
        </div>
      ))}
    </div>
  );
}