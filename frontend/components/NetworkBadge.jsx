import Badge from './ui/Badge';

/**
 * Small pill identifying which network an address, balance, or
 * transaction belongs to.
 */
export default function NetworkBadge({ network, className = '' }) {
  return (
    <Badge tone="default" className={className}>
      <span className="h-1.5 w-1.5 rounded-full bg-success" aria-hidden="true" />
      {network}
    </Badge>
  );
}
