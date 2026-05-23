import { useId } from 'react';

/**
 * Bagel / loaf cross-section. Crust outline + radial-gradient crumb fill +
 * sesame seeds on top + open-crumb holes inside.
 *
 * Uses `useId()` to namespace the `<radialGradient>` id — two copies of
 * this ornament on the same page would otherwise collide on `crumb-grad`.
 */
export function OrnCrossSection({
  width = 120,
  height = 84,
}: {
  width?: number;
  height?: number;
}) {
  const rawId = useId();
  // React's useId can return colons (":r0:"), which are valid in HTML id
  // attributes but awkward inside CSS url(#...) references. Strip them.
  const gradientId = `crumb-grad-${rawId.replace(/:/g, '')}`;
  const color = '#8B6536';
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
      <defs>
        <radialGradient id={gradientId} cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#F0DEB2" />
          <stop offset="100%" stopColor="#C9A876" />
        </radialGradient>
      </defs>
      <path
        d={
          `M ${width * 0.08},${height * 0.55} ` +
          `C ${width * 0.08},${height * 0.18} ${width * 0.92},${height * 0.18} ${width * 0.92},${height * 0.55} ` +
          `L ${width * 0.92},${height * 0.78} ` +
          `C ${width * 0.92},${height * 0.88} ${width * 0.08},${height * 0.88} ${width * 0.08},${height * 0.78} Z`
        }
        fill={`url(#${gradientId})`}
        stroke={color}
        strokeWidth="1.2"
      />
      {Array.from({ length: 14 }).map((_, i) => {
        const x = width * 0.12 + (width * 0.76) * (i / 13) + Math.sin(i * 2.31) * 3;
        const y = height * 0.22 + Math.cos(i * 1.7) * 2;
        return (
          <ellipse
            key={`seed-${i}`}
            cx={x}
            cy={y}
            rx="1.4"
            ry="0.8"
            fill="#F5E0A0"
            transform={`rotate(${(i * 37) % 180} ${x} ${y})`}
          />
        );
      })}
      {Array.from({ length: 16 }).map((_, i) => {
        const cx = width * 0.18 + (width * 0.64) * (((i * 5) % 16) / 15) + Math.sin(i * 1.31) * 4;
        const cy = height * 0.52 + (i % 4) * 5 + Math.cos(i * 0.9) * 3;
        const r = 1.6 + (i % 3) * 0.6;
        return <circle key={`hole-${i}`} cx={cx} cy={cy} r={r} fill="#FBF8F1" opacity="0.7" />;
      })}
      <ellipse cx={width / 2} cy={height - 2} rx={width * 0.34} ry="2" fill="#000" opacity="0.08" />
    </svg>
  );
}
