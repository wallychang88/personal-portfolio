import { CAT_HEX } from './catClass';

/**
 * Compact schematic for the doorpi tile on the homepage Bento. Two named
 * boxes (Pi 0 W ↔ ESP32) connected by a rust trace with a junction dot
 * mid-line and a 12V latch arrow at the right.
 *
 * Visual sibling to OrnSchematic but stripped down to fit a 2×2 tile.
 */
export function PAHomeSchematic({
  width = 380,
  height = 130,
  delay = 1,
}: {
  width?: number;
  height?: number;
  delay?: 1 | 2 | 3 | 4 | 5;
}) {
  const color = '#1C1B17';
  const accent = CAT_HEX.rust;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
      <g fill="none" stroke={color} strokeWidth="1.2">
        <rect x="20" y={height * 0.35} width="80" height="36" />
        <rect x={width - 100} y={height * 0.35} width="80" height="36" />
      </g>
      <path
        className={`orn-draw d${delay}`}
        d={`M100 ${height * 0.55} L ${width - 100} ${height * 0.55}`}
        fill="none"
        stroke={accent}
        strokeWidth="1.6"
      />
      <circle cx={width / 2} cy={height * 0.55} r="3" fill={accent} />
      <text x="22" y={height * 0.3} fontFamily="JetBrains Mono, monospace" fontSize="10" fill={color}>
        Pi 0 W
      </text>
      <text x={width - 98} y={height * 0.3} fontFamily="JetBrains Mono, monospace" fontSize="10" fill={color}>
        ESP32
      </text>
    </svg>
  );
}
