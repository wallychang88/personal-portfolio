import { CAT_HEX } from './catClass';

/**
 * Kitchen bake curve — temp/time line with a steam wisp at the peak.
 * Mirrors the source `OrnBakeCurve` shape: a ramp up, plateau, cool-down.
 *
 * `peakLabel` annotates the peak data point inline (default "500°F"
 * matches the source spec). Pass `peakLabel={null}` to hide the inline
 * label entirely — useful when the top `label` doesn't carry a specific
 * temperature.
 */
export function OrnBakeCurve({
  width = 240,
  height = 70,
  delay = 1,
  label = 'OVEN · 500° · 22 MIN',
  peakLabel = '500°F',
}: {
  width?: number;
  height?: number;
  delay?: 1 | 2 | 3 | 4 | 5;
  label?: string;
  peakLabel?: string | null;
}) {
  const color = CAT_HEX.honey;
  const pts: ReadonlyArray<readonly [number, number]> = [
    [0, 60], [30, 55], [60, 30], [90, 16], [140, 14], [180, 18], [220, 38], [240, 50],
  ];
  const sx = width / 240;
  const sy = height / 70;
  const sp = pts.map(([px, py]) => [px * sx, py * sy] as const);
  const d = sp.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillD =
    `M0,${height} ` +
    sp.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
    ` L${width},${height} Z`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
      <text x="0" y="11" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.06em" fill={color}>
        {label}
      </text>
      <path d={fillD} fill={color} opacity="0.13" />
      <path className={`orn-draw d${delay}`} d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
      <circle cx={100 * sx} cy={16 * sy} r="3" fill={color} />
      {peakLabel && (
        <text x={106 * sx} y={16 * sy + 4} fontSize="10" fontFamily="JetBrains Mono, monospace" fill={color}>
          {peakLabel}
        </text>
      )}
      <g className="orn-steam" style={{ animationDelay: '-1s' }}>
        <ellipse cx={130 * sx} cy={6 * sy} rx="3" ry="4" fill={color} opacity="0.35" />
      </g>
    </svg>
  );
}
