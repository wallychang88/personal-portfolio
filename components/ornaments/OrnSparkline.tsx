import { CAT_HEX, type TagCategory } from './catClass';

/**
 * Generic monotonic-up sparkline. The draw stroke animates on mount;
 * a labeled end-dot anchors the right edge.
 */
export function OrnSparkline({
  width = 240,
  height = 64,
  delay = 1,
  cat = 'slate',
  label = 'AUC · 6 MO',
  endLabel = '0.91',
  data = [0.48, 0.55, 0.61, 0.59, 0.66, 0.72, 0.78, 0.75, 0.82, 0.85, 0.88, 0.91],
}: {
  width?: number;
  height?: number;
  delay?: 1 | 2 | 3 | 4 | 5;
  cat?: TagCategory;
  label?: string;
  endLabel?: string;
  data?: number[];
}) {
  const color = CAT_HEX[cat];
  const sx = width / (data.length - 1);
  const top = 22;
  const bot = height - 8;
  const pts = data.map((d, i) => [i * sx, top + (1 - d) * (bot - top)] as const);
  const d = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillD =
    `M0,${height} ` +
    pts.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
    ` L${width},${height} Z`;
  const end = pts[pts.length - 1];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
      <text x="0" y="11" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.06em" fill={color}>
        {label}
      </text>
      <path d={fillD} fill={color} opacity="0.13" />
      <path className={`orn-draw d${delay}`} d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={end[0] - 1} cy={end[1]} r="3" fill={color} />
      <text x={end[0] - 6} y={end[1] - 7} textAnchor="end" fontSize="10" fontFamily="JetBrains Mono, monospace" fontWeight="600" fill={color}>
        {endLabel}
      </text>
    </svg>
  );
}
