const TONE_CLASSES = {
  default: 'bg-card text-text-secondary border-border',
  primary: 'bg-primary/10 text-primary-hover border-primary/30',
  success: 'bg-success/10 text-success border-success/30',
  danger: 'bg-danger/10 text-danger border-danger/30',
  warning: 'bg-warning/10 text-warning border-warning/30',
};

/**
 * Small pill used for statuses (e.g. "Confirmed", "Pending", "Failed").
 *
 * @param {'default'|'primary'|'success'|'danger'|'warning'} tone
 */
export default function Badge({ children, tone = 'default', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
