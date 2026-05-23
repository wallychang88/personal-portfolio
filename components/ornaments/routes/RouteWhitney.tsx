import { CAT_HEX } from '../catClass';

/**
 * Large Whitney elevation profile — Portal → Trail Camp → 99 switchbacks
 * → Trail Crest → summit → return. Built for the /endurance/ Whitney
 * trophy spread.
 *
 * Gridlines every 2,000 ft from 4k to 14k. Trail Camp marker, dawn-push
 * tick at 2:27, summit pin at 14,505 ft, label "summit" in rust.
 *
 * For the compact tile variant, see OrnEndurance with kind="whitney".
 */
export function RouteWhitney({
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

  // Profile: Portal (8,360 ft) → Outpost (10,360) → Trail Camp (12,039) →
  // 99 switchbacks → Trail Crest (13,650) → summit (14,505) → return.
  const pts: ReadonlyArray<readonly [number, number]> = [
    [0, 200], [60, 178], [120, 158], [180, 138], [240, 118],
    [320, 96], [400, 82], [500, 64], [580, 38], [650, 22],
    [720, 56], [800, 110], [880, 200],
  ];
  const sp = pts.map(([px, py]) => [px * sx, py * sy] as const);
  const d = sp.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillD =
    `M0,${height} ` +
    sp.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
    ` L${width},${height} Z`;

  const grid = [];
  for (const alt of [4000, 6000, 8000, 10000, 12000, 14000]) {
    const y = ((14600 - alt) / 14600) * height;
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

  const trailCampMarker = sp[6];
  const dawnTick = sp[7];
  const summit = sp[9];

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block" role="img" aria-label="Mount Whitney elevation profile — Portal to summit and back, peak 14,505 ft">
      <line x1="0" y1={height - 0.5} x2={width} y2={height - 0.5} stroke="#1C1B17" strokeWidth="0.6" />
      {grid}
      <path d={fillD} fill={color} opacity="0.14" />
      <path className="orn-draw" d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Trail Camp marker (overnight). */}
      <circle cx={trailCampMarker[0]} cy={trailCampMarker[1]} r="4" fill="#FBF8F1" stroke={color} strokeWidth="1.6" />
      <text
        x={trailCampMarker[0] + 6}
        y={trailCampMarker[1] - 8}
        fontSize="10.5"
        fontFamily="JetBrains Mono, monospace"
        fill="#1C1B17"
      >
        Trail Camp · 12,039 ft
      </text>

      {/* Dawn push tick — labels "02:27" in rust. */}
      <line x1={dawnTick[0]} y1={dawnTick[1] - 16} x2={dawnTick[0]} y2={dawnTick[1] - 4} stroke={accent} strokeWidth="1.2" />
      <text
        x={dawnTick[0] + 6}
        y={dawnTick[1] - 18}
        fontSize="10.5"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="600"
        fill={accent}
      >
        dawn push · 02:27
      </text>

      {/* Summit pin. */}
      <polygon
        points={`${summit[0] - 7},${summit[1] + 2} ${summit[0] + 7},${summit[1] + 2} ${summit[0]},${summit[1] - 11}`}
        fill={accent}
      />
      <text
        x={summit[0] + 12}
        y={summit[1] + 3}
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fill={accent}
      >
        14,505 ft · summit
      </text>

      <text x="6" y={height - 6} fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill="#5C5A52" letterSpacing="0.04em">
        Whitney Portal
      </text>
      <text x={width - 6} y={height - 6} textAnchor="end" fontSize="9.5" fontFamily="JetBrains Mono, monospace" fill="#5C5A52" letterSpacing="0.04em">
        return
      </text>
    </svg>
  );
}
