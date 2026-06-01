import { CAT_HEX } from './catClass';

export type EnduranceKind = 'tioga' | 'whitney' | 'race' | 'timeline';

/**
 * Compact endurance ornaments — used on tiles + section thumbnails.
 *
 * - `tioga`     → elevation profile with a peak dot + summit label
 * - `whitney`   → elevation profile with a triangular peak
 * - `race`      → 3-leg SWIM/BIKE/RUN bar chart (bike highlighted)
 * - `timeline`  → labeled-tick legacy ribbon
 *
 * For the larger route SVGs that live on /sweat/, see `routes/` (built
 * during Phase 4).
 */
export function OrnEndurance({
  kind,
  width = 240,
  height = 70,
  delay = 1,
  summitLabel,
}: {
  kind: EnduranceKind;
  width?: number;
  height?: number;
  delay?: 1 | 2 | 3 | 4 | 5;
  summitLabel?: string;
}) {
  const color = CAT_HEX.sage;

  if (kind === 'tioga') {
    // Same west-to-east silhouette as the large /sweat/ RouteTioga
    // profile (downsampled): Crane Flat → rolling climb → Tuolumne
    // Meadows → Tioga Pass peak at ~53% across → the long drop to Mono
    // Lake, which ends lower than the start. Keep this in step with
    // routes/RouteTioga.tsx so the homepage tile matches the detail page.
    const pts: ReadonlyArray<readonly [number, number]> = [
      [0, 41.8], [16.4, 34.2], [32.7, 29.3], [49.1, 32.1], [65.5, 28.3],
      [81.8, 26.6], [92.7, 28.3], [106.4, 24.8], [117.3, 21.0], [128.2, 15.9],
      [141.8, 27.9], [158.2, 33.5], [174.5, 37.7], [190.9, 43.2], [207.3, 48.8],
      [223.6, 54.3], [240, 57.1],
    ];
    const sx = width / 240;
    const sy = height / 70;
    const sp = pts.map(([px, py]) => [px * sx, py * sy] as const);
    const d = sp.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const fillD =
      `M0,${height} ` +
      sp.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
      ` L${width},${height} Z`;
    const peak = sp[9];
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
        <line x1="0" y1={height - 0.5} x2={width} y2={height - 0.5} stroke={color} strokeWidth="0.4" opacity="0.5" />
        <path d={fillD} fill={color} opacity="0.12" />
        <path className={`orn-draw d${delay}`} d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
        <circle cx={peak[0]} cy={peak[1]} r="3" fill={color} />
        {summitLabel && (
          <text x={peak[0] + 6} y={peak[1] + 4} fontSize="10" fontFamily="JetBrains Mono, monospace" fill={color}>
            {summitLabel}
          </text>
        )}
      </svg>
    );
  }

  if (kind === 'whitney') {
    const pts: ReadonlyArray<readonly [number, number]> = [
      [0, 60], [35, 48], [70, 38], [100, 28], [125, 16], [160, 32], [200, 46], [240, 58],
    ];
    const sx = width / 240;
    const sy = height / 70;
    const sp = pts.map(([px, py]) => [px * sx, py * sy] as const);
    const d = sp.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
    const fillD =
      `M0,${height} ` +
      sp.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
      ` L${width},${height} Z`;
    const peakX = 125 * sx;
    const peakY = 16 * sy;
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
        <line x1="0" y1={height - 0.5} x2={width} y2={height - 0.5} stroke={color} strokeWidth="0.4" opacity="0.5" />
        <path d={fillD} fill={color} opacity="0.12" />
        <path className={`orn-draw d${delay}`} d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinejoin="round" />
        <polygon points={`${peakX - 5},${peakY + 2} ${peakX + 5},${peakY + 2} ${peakX},${peakY - 7}`} fill={color} />
        {summitLabel && (
          <text x={peakX + 10} y={peakY + 4} fontSize="10" fontFamily="JetBrains Mono, monospace" fill={color}>
            {summitLabel}
          </text>
        )}
      </svg>
    );
  }

  if (kind === 'race') {
    // 3-leg race chart: swim / bike / run normalized splits, bike highlighted.
    const swim = 0.13;
    const bike = 0.48;
    const run = 0.39;
    const totalW = width - 4;
    const swimW = swim * totalW;
    const bikeW = bike * totalW;
    const runW = run * totalW;
    // Layout: kicker (top) · bike-rank label · bar group (bottom).
    // The bike bar is raised by `lift`; we anchor the rank label above
    // the raised top, not the baseline, so they never overlap.
    const lift = 3;
    const barH = Math.max(12, Math.round(height * 0.24));
    const barY = height - barH - 4;
    const bikeTopY = barY - lift;
    const labelY = bikeTopY - 7;
    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
        <text x="0" y="11" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.06em" fill={color}>
          SWIM · BIKE · RUN
        </text>
        <rect
          className="orn-bar-grow"
          x="2"
          y={barY}
          width={swimW}
          height={barH}
          fill={color}
          opacity="0.45"
          style={{ animationDelay: `${delay * 0.15}s`, transformOrigin: `${2 + swimW / 2}px ${barY + barH}px` }}
        />
        <rect
          className="orn-bar-grow"
          x={2 + swimW + 2}
          y={bikeTopY}
          width={bikeW}
          height={barH + lift * 2}
          fill={color}
          style={{ animationDelay: `${delay * 0.15 + 0.15}s`, transformOrigin: `${2 + swimW + 2 + bikeW / 2}px ${bikeTopY + barH + lift * 2}px` }}
        />
        <rect
          className="orn-bar-grow"
          x={2 + swimW + bikeW + 4}
          y={barY}
          width={runW}
          height={barH}
          fill={color}
          opacity="0.65"
          style={{ animationDelay: `${delay * 0.15 + 0.3}s`, transformOrigin: `${2 + swimW + bikeW + 4 + runW / 2}px ${barY + barH}px` }}
        />
        <text
          x={2 + swimW + 2 + bikeW / 2}
          y={labelY}
          textAnchor="middle"
          fontSize="10"
          fontFamily="JetBrains Mono, monospace"
          fontWeight="600"
          fill={color}
        >
          div rank 39
        </text>
      </svg>
    );
  }

  // kind === 'timeline'
  const ticks = [
    { x: 0.06, l: '2021' },
    { x: 0.32, l: '2023' },
    { x: 0.55, l: '2024' },
    { x: 0.78, l: '2025' },
    { x: 0.96, l: '2026' },
  ];
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
      <text x="0" y="11" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.06em" fill={color}>
        SPRINT FB · IRONMAN · WHITNEY · TIOGA
      </text>
      <line x1="4" y1={height * 0.55} x2={width - 4} y2={height * 0.55} stroke={color} strokeWidth="1.2" />
      {ticks.map((t) => (
        <g key={t.l}>
          <line x1={t.x * width} y1={height * 0.55 - 4} x2={t.x * width} y2={height * 0.55 + 4} stroke={color} strokeWidth="1.2" />
          <text x={t.x * width} y={height * 0.55 + 18} textAnchor="middle" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill={color}>
            {t.l}
          </text>
        </g>
      ))}
    </svg>
  );
}
