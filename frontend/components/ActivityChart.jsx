import { TrendingUp } from 'lucide-react';
import Card from './ui/Card';

/**
 * Lightweight, dependency-free area chart used for the dashboard's
 * "Activity Overview". Renders an SVG sparkline from a plain array of
 * numbers -- purely presentational (UI only), no real data source yet.
 *
 * @param {number[]} data - ordered series, oldest first
 * @param {string} label
 * @param {string} rangeLabel - e.g. "Last 14 days"
 */
export default function ActivityChart({ data = [], label = 'Portfolio Value', rangeLabel = 'Last 14 days' }) {
  const width = 600;
  const height = 160;
  const padding = 8;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;

  const points = data.map((value, i) => {
    const x = padding + (i / (data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((value - min) / span) * (height - padding * 2);
    return [x, y];
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x},${y}`).join(' ');
  const areaPath = `${linePath} L${points[points.length - 1][0]},${height} L${points[0][0]},${height} Z`;

  const first = data[0];
  const last = data[data.length - 1];
  const changePct = first ? (((last - first) / first) * 100).toFixed(1) : '0.0';
  const isUp = last >= first;

  return (
    <Card padding="lg">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <TrendingUp className="h-4.5 w-4.5 text-primary-hover" aria-hidden="true" />
            <h3 className="text-base font-semibold text-text-primary">{label}</h3>
          </div>
          <p className="mt-1 text-xs text-text-secondary">{rangeLabel}</p>
        </div>
        <span className={`text-sm font-medium font-mono-data ${isUp ? 'text-success' : 'text-danger'}`}>
          {isUp ? '+' : ''}
          {changePct}%
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="mt-5 h-36 w-full"
        preserveAspectRatio="none"
        role="img"
        aria-label={`${label} trend over the selected period`}
      >
        <defs>
          <linearGradient id="activity-chart-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.28" />
            <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#activity-chart-fill)" stroke="none" />
        <path
          d={linePath}
          fill="none"
          stroke="var(--color-primary)"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {points.length > 0 && (
          <circle
            cx={points[points.length - 1][0]}
            cy={points[points.length - 1][1]}
            r="4"
            fill="var(--color-primary)"
            stroke="var(--color-card)"
            strokeWidth="2"
          />
        )}
      </svg>
    </Card>
  );
}
