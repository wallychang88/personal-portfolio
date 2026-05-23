import { CAT_HEX } from '../catClass';

/**
 * IRONMAN 70.3 race profile — Swim · T1 · Bike · T2 · Run, sized by
 * actual split fractions, with Bike elevated + at full opacity to mark
 * div-rank 39. Built for the /endurance/ Ironman trophy spread.
 *
 * Splits per WALLY.md (5:41:08 total):
 *   Swim  0:43:42  · T1 0:06:20  · Bike 2:44:15  · T2 0:06:38  · Run 2:00:13
 *
 * Fractions computed from absolute seconds so the bar widths reflect
 * reality, not eyeballed proportions.
 */
const SECONDS: ReadonlyArray<{
  name: string;
  sub?: string;
  time: string;
  s: number;
  highlight?: boolean;
}> = [
  { name: 'SWIM', sub: '1.2 mi',                  time: '0:43:42', s: 43 * 60 + 42 },
  { name: 'T1',   sub: 'transition',              time: '0:06:20', s: 6 * 60 + 20 },
  { name: 'BIKE', sub: '56 mi · div rank 39',     time: '2:44:15', s: 2 * 3600 + 44 * 60 + 15, highlight: true },
  { name: 'T2',   sub: 'transition',              time: '0:06:38', s: 6 * 60 + 38 },
  { name: 'RUN',  sub: '13.1 mi',                 time: '2:00:13', s: 2 * 3600 + 13 },
];

export function RouteIronman({
  width = 880,
  height = 220,
}: {
  width?: number;
  height?: number;
}) {
  const color = CAT_HEX.sage;
  const accent = CAT_HEX.rust;
  const total = SECONDS.reduce((sum, l) => sum + l.s, 0);
  const padX = 12;
  const trackW = width - padX * 2;
  const barH = 38;
  const barY = height / 2 - barH / 2;

  let x = padX;
  const bars: React.ReactElement[] = [];
  for (let i = 0; i < SECONDS.length; i++) {
    const leg = SECONDS[i];
    const w = (leg.s / total) * trackW;
    const cx = x + w / 2;
    const isBike = !!leg.highlight;
    const opacity = isBike ? 1 : leg.name === 'RUN' ? 0.65 : leg.name === 'SWIM' ? 0.45 : 0.3;
    const rectY = isBike ? barY - 6 : barY;
    const rectH = isBike ? barH + 12 : barH;
    bars.push(
      <g key={leg.name}>
        <rect
          className="orn-bar-grow"
          x={x}
          y={rectY}
          width={Math.max(w - 2, 0)}
          height={rectH}
          fill={color}
          opacity={opacity}
          style={{
            animationDelay: `${0.1 + i * 0.12}s`,
            transformOrigin: `${cx}px ${rectY + rectH}px`,
          }}
        />
        <text
          x={cx}
          y={barY - 12}
          textAnchor="middle"
          fontSize="10.5"
          fontFamily="JetBrains Mono, monospace"
          fontWeight={isBike ? 700 : 500}
          fill={isBike ? accent : '#1C1B17'}
        >
          {leg.name}
        </text>
        {/* Sub + time labels only on wide-enough segments — the
            transitions are too narrow for legible text. */}
        {w > 60 && (
          <>
            <text x={cx} y={barY + barH + 22} textAnchor="middle" fontSize="10" fontFamily="JetBrains Mono, monospace" fill="#5C5A52">
              {leg.sub}
            </text>
            <text
              x={cx}
              y={barY + barH + 38}
              textAnchor="middle"
              fontSize="13"
              fontFamily="Fraunces, serif"
              fontWeight="500"
              fill="#1C1B17"
            >
              {leg.time}
            </text>
          </>
        )}
      </g>,
    );
    x += w;
  }

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="block" role="img" aria-label="IRONMAN 70.3 race profile — five segments sized by split time, bike highlighted">
      <text
        x={padX}
        y="20"
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
        fill="#5C5A52"
        letterSpacing="0.06em"
      >
        RACE PROFILE · 5:41:08 TOTAL · M18–24
      </text>
      {bars}
      <line
        x1={padX}
        y1={barY + barH + 4}
        x2={width - padX}
        y2={barY + barH + 4}
        stroke="#1C1B17"
        strokeWidth="0.4"
        opacity="0.4"
      />
    </svg>
  );
}
