import { CAT_HEX } from './catClass';

/**
 * Faint moss-color contour rings drifting behind the page. Decorative;
 * sits at z-index 0 under the editorial content. Four "peaks" scattered
 * across the canvas, each radiating 7-9 hand-noised rings.
 *
 * The ring coordinates use Math.sin / Math.cos with a deterministic seed
 * — same output every render so the page doesn't shimmer during a
 * hydration mismatch.
 */
function ring(cx: number, cy: number, r: number, seed: number) {
  const pts = 26;
  let d = '';
  for (let i = 0; i < pts; i++) {
    const a = (i / pts) * Math.PI * 2;
    const j = 1 + Math.sin(seed + i * 1.1) * 0.13 + Math.cos(seed * 0.7 + i * 0.9) * 0.09;
    const x = cx + Math.cos(a) * r * j;
    const y = cy + Math.sin(a) * r * j * 0.94;
    d += `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)} `;
  }
  return d + 'Z';
}

interface Peak {
  cx: number;
  cy: number;
  r0: number;
  n: number;
  op: number;
}

const PEAKS: ReadonlyArray<Peak> = [
  { cx: 230,  cy: 240,  r0: 60, n: 8, op: 0.08 },
  { cx: 1080, cy: 800,  r0: 70, n: 9, op: 0.07 },
  { cx: 460,  cy: 1700, r0: 80, n: 9, op: 0.07 },
  { cx: 1100, cy: 2160, r0: 60, n: 7, op: 0.06 },
];

export function ContourBackground({
  width = 1280,
  height = 2400,
}: {
  width?: number;
  height?: number;
}) {
  const color = CAT_HEX.sage;
  return (
    <svg
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      {PEAKS.map((p, pi) => (
        <g key={pi}>
          {Array.from({ length: p.n }).map((_, i) => (
            <path
              key={i}
              d={ring(p.cx, p.cy, p.r0 + i * 36, pi * 3 + i)}
              fill="none"
              stroke={color}
              strokeWidth="1"
              opacity={p.op + i * 0.012}
            />
          ))}
        </g>
      ))}
    </svg>
  );
}
