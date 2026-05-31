import { CAT_HEX } from '../catClass';

/**
 * Cornell Sprint Football career arc — three seasons (2021–22 / 2022–23
 * / 2023–24) with the DB → WR transition in the senior year, roster
 * stamp #87 on the left, and an All-CSFL Academic pin on the senior
 * season. Built for the /sweat/ football trophy spread; mirrors the
 * shape of the elevation profiles in this folder.
 *
 * Facts come from WALLY.md + content/timeline/2023-11-30-cornell-sprint-football.md:
 *   • Three seasons on roster (Sophomore → Senior).
 *   • Defensive back as a sophomore; wide receiver as a junior + senior.
 *   • Senior season: six games, All-CSFL Academic honors.
 *   • 178-lb collegiate weight cap; nine schools play.
 */

const SEASONS: ReadonlyArray<{
  label: string;
  year: string;
  position: string;
  highlight?: boolean;
  note?: string;
}> = [
  { label: 'SOPHOMORE', year: '2021–22', position: 'DB' },
  { label: 'JUNIOR',    year: '2022–23', position: 'WR' },
  { label: 'SENIOR',    year: '2023–24', position: 'WR', highlight: true, note: 'All-CSFL Academic · 6 games' },
];

export function RouteFootball({
  width = 880,
  height = 220,
}: {
  width?: number;
  height?: number;
}) {
  const color = CAT_HEX.sage;
  const accent = CAT_HEX.rust;
  const padX = 12;
  const trackW = width - padX * 2;
  const barH = 44;
  const barY = height / 2 - barH / 2 + 4;
  const gap = 14;
  const blockW = (trackW - gap * (SEASONS.length - 1)) / SEASONS.length;

  return (
    <svg
      width="100%"
      viewBox={`0 0 ${width} ${height}`}
      className="block"
      role="img"
      aria-label="Cornell Sprint Football — three seasons, DB to WR, #87, All-CSFL Academic as a senior"
    >
      {/* Baseline rule. */}
      <line
        x1="0"
        y1={height - 0.5}
        x2={width}
        y2={height - 0.5}
        stroke="#1C1B17"
        strokeWidth="0.6"
      />

      {/* Roster stamp — left side. Mirrors the elevation-profile axis labels. */}
      <text
        x={padX}
        y={28}
        fontSize="11"
        fontFamily="JetBrains Mono, monospace"
        fontWeight="700"
        fill={accent}
        letterSpacing="0.08em"
      >
        #87 · DB → WR
      </text>
      <text
        x={padX}
        y={44}
        fontSize="10"
        fontFamily="JetBrains Mono, monospace"
        fill="#5C5A52"
        letterSpacing="0.04em"
      >
        178-lb cap · 9 schools
      </text>

      {/* Three season blocks. */}
      {SEASONS.map((s, i) => {
        const x = padX + i * (blockW + gap);
        const opacity = s.highlight ? 0.22 : 0.12;
        return (
          <g key={s.label}>
            {/* Season block — filled rect + outline. */}
            <rect
              x={x}
              y={barY}
              width={blockW}
              height={barH}
              fill={color}
              opacity={opacity}
            />
            <rect
              x={x}
              y={barY}
              width={blockW}
              height={barH}
              fill="none"
              stroke={color}
              strokeWidth={s.highlight ? 1.8 : 1.2}
            />

            {/* Season label inside block — eyebrow + position. */}
            <text
              x={x + 10}
              y={barY + 18}
              fontSize="10.5"
              fontFamily="JetBrains Mono, monospace"
              fontWeight="700"
              fill="#1C1B17"
              letterSpacing="0.08em"
            >
              {s.label}
            </text>
            <text
              x={x + 10}
              y={barY + 34}
              fontSize="14"
              fontFamily="Fraunces, serif"
              fontWeight="500"
              fill="#1C1B17"
            >
              {s.position}
            </text>

            {/* Year stamp below the block. */}
            <text
              x={x + blockW - 8}
              y={barY + barH + 16}
              fontSize="10"
              fontFamily="JetBrains Mono, monospace"
              fill="#5C5A52"
              textAnchor="end"
              letterSpacing="0.04em"
            >
              {s.year}
            </text>

            {/* Senior-season pin: All-CSFL Academic + 6 games. */}
            {s.highlight && s.note ? (
              <>
                <polygon
                  points={`${x + blockW - 10},${barY - 6} ${x + blockW},${barY - 6} ${x + blockW - 5},${barY - 16}`}
                  fill={accent}
                />
                <text
                  x={x + blockW - 6}
                  y={barY - 22}
                  fontSize="10.5"
                  fontFamily="JetBrains Mono, monospace"
                  fontWeight="700"
                  fill={accent}
                  textAnchor="end"
                  letterSpacing="0.04em"
                >
                  {s.note}
                </text>
              </>
            ) : null}
          </g>
        );
      })}

      {/* Off-season tick marks between blocks — dashed gap. */}
      {SEASONS.slice(0, -1).map((_, i) => {
        const x = padX + (i + 1) * blockW + i * gap + gap / 2;
        return (
          <line
            key={`gap${i}`}
            x1={x}
            y1={barY + 8}
            x2={x}
            y2={barY + barH - 8}
            stroke={color}
            strokeWidth="1"
            strokeDasharray="2 4"
            opacity="0.6"
          />
        );
      })}
    </svg>
  );
}
