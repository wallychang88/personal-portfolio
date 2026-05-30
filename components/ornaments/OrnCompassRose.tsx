import { CAT_HEX, type TagCategory } from './catClass';

/**
 * Compass rose for the /sweat/ masthead. 16-tick dial with N-S vanes,
 * a 6s idle drift, and a -2deg hover lock. Pure CSS hover — server-safe.
 */
export function OrnCompassRose({
  size = 80,
  accent = 'rust',
}: {
  size?: number;
  accent?: TagCategory;
}) {
  const r = size / 2;
  const accentHex = CAT_HEX[accent];
  return (
    <svg
      className="orn-compass"
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label="Compass rose"
    >
      <circle cx={r} cy={r} r={r - 2} fill="none" stroke="#1C1B17" strokeWidth="0.7" />
      <circle cx={r} cy={r} r={r - 10} fill="none" stroke="#1C1B17" strokeWidth="0.4" strokeDasharray="2 3" />
      {Array.from({ length: 16 }).map((_, i) => {
        const a = (i / 16) * Math.PI * 2 - Math.PI / 2;
        const long = i % 4 === 0;
        const x1 = r + Math.cos(a) * (r - 2);
        const y1 = r + Math.sin(a) * (r - 2);
        const x2 = r + Math.cos(a) * (r - (long ? 9 : 5));
        const y2 = r + Math.sin(a) * (r - (long ? 9 : 5));
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#1C1B17"
            strokeWidth={long ? 1 : 0.5}
          />
        );
      })}
      <polygon points={`${r},${r - (r - 12)} ${r - 5},${r} ${r},${r - 3} ${r + 5},${r}`} fill={accentHex} />
      <polygon points={`${r},${r + (r - 12)} ${r - 5},${r} ${r},${r + 3} ${r + 5},${r}`} fill="#1C1B17" opacity="0.55" />
      <circle cx={r} cy={r} r="2.2" fill="#1C1B17" />
      <text x={r} y={11} textAnchor="middle" fontSize="8" fontFamily="JetBrains Mono, monospace" fontWeight="700" fill="#1C1B17">
        N
      </text>
    </svg>
  );
}
