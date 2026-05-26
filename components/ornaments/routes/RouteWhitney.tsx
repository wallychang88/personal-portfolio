import { CAT_HEX } from '../catClass';

/**
 * Large Whitney elevation profile — Portal → Trail Camp → 99 switchbacks
 * → Trail Crest → summit → return. Built for the /endurance/ Whitney
 * trophy spread.
 *
 * Chart spans 8,000–15,000 ft so the trail (8,360 → 14,505) fills the
 * frame and the summit pin has breathing room below the SVG top edge.
 * Gridlines every 2,000 ft. Trail Camp marker, dawn-push tick at 2:27,
 * summit pin at 14,505 ft.
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

  const altMin = 8000;
  const altMax = 15000;
  const yFor = (alt: number) => ((altMax - alt) / (altMax - altMin)) * 220;

  // Profile: Portal (8,360 ft) → Outpost (10,360) → Trail Camp (12,039) →
  // 99 switchbacks → Trail Crest (13,650) → summit (14,505) → return.
  const pts: ReadonlyArray<readonly [number, number]> = [
    [0,   yFor(8360)],   // Portal
    [60,  yFor(9100)],
    [120, yFor(9800)],
    [180, yFor(10360)],  // Outpost Camp
    [240, yFor(11100)],
    [320, yFor(11600)],
    [400, yFor(12039)],  // Trail Camp ← marker (sp[6])
    [500, yFor(12500)],  // dawn push past Trail Camp ← tick (sp[7])
    [580, yFor(13650)],  // Trail Crest
    [650, yFor(14505)],  // summit ← pin (sp[9])
    [720, yFor(13650)],  // descent through Trail Crest
    [800, yFor(12039)],  // descent through Trail Camp
    [880, yFor(8360)],   // return to Portal
  ];
  const sp = pts.map(([px, py]) => [px * sx, py * sy] as const);
  const d = sp.map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ');
  const fillD =
    `M0,${height} ` +
    sp.map((p) => `L${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(' ') +
    ` L${width},${height} Z`;

  const grid = [];
  for (const alt of [8000, 10000, 12000, 14000]) {
    const y = ((altMax - alt) / (altMax - altMin)) * height;
    grid.push(
      <line key={`g${alt}`} x1="0" y1={y} x2={width} y2={y} stroke="#1C1B17" strokeWidth="0.4" strokeDasharray="2 5" opacity="0.18" />,
    );
    grid.push(
      <text
        key={`l${alt}`}
        x="6"
        y={y - 4}
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

      {/* Trail Camp marker (overnight). Label sits above the dot. */}
      <circle cx={trailCampMarker[0]} cy={trailCampMarker[1]} r="4" fill="#FBF8F1" stroke={color} strokeWidth="1.6" />
      <text
        x={trailCampMarker[0] + 8}
        y={trailCampMarker[1] - 8}
        fontSize="10.5"
        fontFamily="JetBrains Mono, monospace"
        fill="#1C1B17"
      >
        Trail Camp · 12,039 ft
      </text>

      {/* Dawn push tick — labels "02:27" in rust, anchored above the tick. */}
      <line x1={dawnTick[0]} y1={dawnTick[1] - 18} x2={dawnTick[0]} y2={dawnTick[1] - 6} stroke={accent} strokeWidth="1.2" />
      <text
        x={dawnTick[0] + 6}
        y={dawnTick[1] - 22}
        fontSize="10.5"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="600"
        fill={accent}
      >
        dawn push · 02:27
      </text>

      {/* Summit pin — label below pin tip so it never gets clipped at top. */}
      <polygon
        points={`${summit[0] - 7},${summit[1] + 2} ${summit[0] + 7},${summit[1] + 2} ${summit[0]},${summit[1] - 11}`}
        fill={accent}
      />
      <text
        x={summit[0] + 10}
        y={summit[1] + 14}
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fill={accent}
      >
        14,505 ft · summit
      </text>
    </svg>
  );
}
