import { CAT_HEX } from '../catClass';

/**
 * Large Tioga Road elevation profile — Crane Flat west of the gate,
 * climbing through Tuolumne Meadows to Tioga Pass at 9,945 ft, then the
 * long drop east toward Mono Lake. Built for the /sweat/ Tioga
 * trophy spread.
 *
 * Gridlines every 2,000 ft from 4k to 10k. Gate marker on the start,
 * Tioga Pass summit pin, Tuolumne Meadows annotation past the peak.
 */
export function RouteTioga({
  width = 880,
  height = 220,
}: {
  width?: number;
  height?: number;
}) {
  const color = CAT_HEX.sage;
  const accent = CAT_HEX.rust;
  const sx = width / 880;
  const sy = height / 220;

  // Chart spans 3,000–10,500 ft so the route (≈6,200 → 9,945 → 4,000)
  // fills the canvas. All point y-values are computed from this range so
  // they line up with the printed gridline labels.
  const altMin = 3000;
  const altMax = 10500;
  const yFor = (alt: number) => ((altMax - alt) / (altMax - altMin)) * 220;

  // 88-mile west-to-east point-to-point: Crane Flat (≈6,200 ft) →
  // Tuolumne Meadows (≈8,650) → Tioga Pass (9,945) → Lee Vining drop →
  // out toward Mono Basin (≈4,000). Meadows sit *before* the pass on
  // the climb, not after.
  const pts: ReadonlyArray<readonly [number, number]> = [
    [0,   yFor(6200)],   // Crane Flat ← startMarker (sp[0])
    [60,  yFor(7300)],
    [120, yFor(8000)],   // White Wolf area
    [180, yFor(7600)],
    [240, yFor(8150)],
    [300, yFor(8400)],   // Olmsted Point
    [340, yFor(8150)],   // Tenaya Lake dip
    [390, yFor(8650)],   // Tuolumne Meadows ← meadows marker (sp[7])
    [430, yFor(9200)],
    [470, yFor(9945)],   // Tioga Pass ← peak (sp[9])
    [520, yFor(8200)],
    [580, yFor(7400)],
    [640, yFor(6800)],   // Lee Vining
    [700, yFor(6000)],
    [760, yFor(5200)],
    [820, yFor(4400)],
    [880, yFor(4000)],   // Mile 88
  ];
  const sp = pts.map(([px, py]) => [px * sx, py * sy] as const);
  const d = sp.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillD =
    `M0,${height} ` +
    sp.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
    ` L${width},${height} Z`;

  const grid = [];
  for (const alt of [4000, 6000, 8000, 10000]) {
    const y = ((altMax - alt) / (altMax - altMin)) * height;
    grid.push(
      <line key={`g${alt}`} x1="0" y1={y} x2={width} y2={y} stroke="#1C1B17" strokeWidth="0.4" strokeDasharray="2 5" opacity="0.18" />,
    );
    grid.push(
      <text
        key={`l${alt}`}
        x="6"
        y={y - 3}
        fontSize="9.5"
        fontFamily="JetBrains Mono, monospace"
        fill="#5C5A52"
        letterSpacing="0.04em"
      >
        {alt.toLocaleString()} ft
      </text>,
    );
  }

  const startMarker = sp[0];
  const peak = sp[9];
  const meadows = sp[7];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block" role="img" aria-label="Tioga Road elevation profile — Crane Flat to Mono Lake via Tioga Pass">
      <line x1="0" y1={height - 0.5} x2={width} y2={height - 0.5} stroke="#1C1B17" strokeWidth="0.6" />
      {grid}
      <path d={fillD} fill={color} opacity="0.14" />
      <path className="orn-draw" d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Start marker. */}
      <circle cx={startMarker[0]} cy={startMarker[1]} r="4" fill="#FBF8F1" stroke={color} strokeWidth="1.6" />
      <text
        x={startMarker[0] + 6}
        y={startMarker[1] - 6}
        fontSize="10.5"
        fontFamily="JetBrains Mono, monospace"
        fill="#1C1B17"
      >
        Crane Flat · 7:11 a.m.
      </text>

      {/* Tioga Pass summit pin — label below tip so it never gets clipped. */}
      <polygon
        points={`${peak[0] - 7},${peak[1] + 2} ${peak[0] + 7},${peak[1] + 2} ${peak[0]},${peak[1] - 11}`}
        fill={accent}
      />
      <text
        x={peak[0] + 10}
        y={peak[1] + 14}
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fill={accent}
      >
        Tioga Pass · 9,945 ft
      </text>

      {/* Tuolumne Meadows mid-route — label sits BELOW the dot, away from
          the descending Pass label, so the two never collide horizontally. */}
      <circle cx={meadows[0]} cy={meadows[1]} r="3.5" fill={accent} />
      <text
        x={meadows[0] - 6}
        y={meadows[1] + 16}
        textAnchor="end"
        fontSize="10.5"
        fontFamily="JetBrains Mono, monospace"
        fill="#1C1B17"
      >
        Tuolumne Meadows
      </text>

      <text x="6" y={height - 6} fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill="#5C5A52">
        Mi 0
      </text>
      <text x={width - 6} y={height - 6} textAnchor="end" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill="#5C5A52">
        Mi 88
      </text>
    </svg>
  );
}
