/**
 * Single row inside a SettingsSection: a label (+ optional helper
 * text) on the left, an arbitrary control (Toggle, Button, Badge...)
 * on the right.
 *
 * @param {string} label
 * @param {string} helperText
 */
export default function SettingsRow({ label, helperText, children }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border pb-4 last:border-b-0 last:pb-0">
      <div>
        <p className="text-sm text-text-primary">{label}</p>
        {helperText && <p className="mt-0.5 text-xs text-text-secondary">{helperText}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
