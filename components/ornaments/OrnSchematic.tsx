import { CAT_HEX } from './catClass';

/**
 * Full hardware schematic — Pi Zero W → Camera → MediaPipe → ESP32 → 12V
 * relay latch. A signal pulse rides the rust trace via offset-path.
 *
 * The pulse-path is set inline via the `--orn-pulse-path` CSS variable
 * because offset-path doesn't accept SVG <defs> id references reliably
 * across engines; inlining the path() string keeps it portable.
 *
 * Used as the FIG. 01 strip at the top of /projects/doorpi/.
 */
export function OrnSchematic({
  width = 880,
  height = 220,
  delay = 1,
}: {
  width?: number;
  height?: number;
  delay?: 1 | 2 | 3 | 4 | 5;
}) {
  const color = '#1C1B17';
  const accent = CAT_HEX.rust;

  // The pulse path retraces: Pi → MediaPipe → ESP32 → relay.
  const pulsePath =
    `M ${width * 0.18} ${height * 0.55} ` +
    `L ${width * 0.3} ${height * 0.55} ` +
    `L ${width * 0.3} ${height * 0.4} ` +
    `L ${width * 0.5} ${height * 0.4} ` +
    `L ${width * 0.5} ${height * 0.55} ` +
    `L ${width * 0.7} ${height * 0.55} ` +
    `L ${width * 0.7} ${height * 0.42} ` +
    `L ${width * 0.86} ${height * 0.42}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" role="img" aria-label="doorpi system schematic">
      <g fontFamily="JetBrains Mono, monospace" fontSize="9.5" fill={color}>
        {/* Pi Zero W */}
        <g>
          <rect x={width * 0.06} y={height * 0.42} width={width * 0.18} height={height * 0.3} fill="none" stroke={color} strokeWidth="1" />
          <text x={width * 0.075} y={height * 0.38}>Pi Zero W</text>
          <text x={width * 0.075} y={height * 0.6} fontSize="8.5" fill="#5C5A52">/dev/video0</text>
          <text x={width * 0.075} y={height * 0.68} fontSize="8.5" fill="#5C5A52">GPIO 18</text>
        </g>
        {/* Camera */}
        <g>
          <rect x={width * 0.31} y={height * 0.18} width={width * 0.18} height={height * 0.2} fill="none" stroke={color} strokeWidth="1" />
          <text x={width * 0.325} y={height * 0.14}>Camera v2</text>
          <text x={width * 0.325} y={height * 0.34} fontSize="8.5" fill="#5C5A52">1080p · 30fps</text>
        </g>
        {/* MediaPipe */}
        <g>
          <rect x={width * 0.4} y={height * 0.42} width={width * 0.18} height={height * 0.3} fill="none" stroke={color} strokeWidth="1" />
          <text x={width * 0.415} y={height * 0.38}>MediaPipe</text>
          <text x={width * 0.415} y={height * 0.6} fontSize="8.5" fill="#5C5A52">hands · 0.6</text>
          <text x={width * 0.415} y={height * 0.68} fontSize="8.5" fill="#5C5A52">face_match</text>
        </g>
        {/* ESP32 */}
        <g>
          <rect x={width * 0.61} y={height * 0.42} width={width * 0.18} height={height * 0.3} fill="none" stroke={color} strokeWidth="1" />
          <text x={width * 0.625} y={height * 0.38}>ESP32</text>
          <text x={width * 0.625} y={height * 0.6} fontSize="8.5" fill="#5C5A52">J3:7</text>
          <text x={width * 0.625} y={height * 0.68} fontSize="8.5" fill="#5C5A52">UART · 115200</text>
        </g>
        {/* Relay */}
        <g>
          <rect x={width * 0.83} y={height * 0.3} width={width * 0.13} height={height * 0.24} fill="none" stroke={color} strokeWidth="1" />
          <text x={width * 0.84} y={height * 0.26}>Relay</text>
          <text x={width * 0.84} y={height * 0.46} fontSize="8.5" fill="#5C5A52">12V latch</text>
        </g>
      </g>

      {/* Camera → Pi feed line (animates first) */}
      <path
        d={`M${width * 0.4},${height * 0.28} L${width * 0.24},${height * 0.28} L${width * 0.24},${height * 0.45}`}
        fill="none"
        stroke={color}
        strokeWidth="1"
      />
      {/* Pi → MediaPipe */}
      <path
        className={`orn-draw d${delay}`}
        d={`M${width * 0.24},${height * 0.55} L${width * 0.4},${height * 0.55}`}
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
      />
      {/* MediaPipe → ESP32 */}
      <path
        className={`orn-draw d${Math.min((delay + 1) as 1 | 2 | 3 | 4 | 5, 5)}`}
        d={`M${width * 0.58},${height * 0.55} L${width * 0.61},${height * 0.55}`}
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
      />
      {/* ESP32 → Relay */}
      <path
        className={`orn-draw d${Math.min((delay + 2) as 1 | 2 | 3 | 4 | 5, 5)}`}
        d={`M${width * 0.79},${height * 0.55} L${width * 0.83},${height * 0.42}`}
        stroke={accent}
        strokeWidth="1.4"
        fill="none"
      />

      {/* Junction dots */}
      <circle cx={width * 0.24} cy={height * 0.28} r="2" fill={color} />
      <circle cx={width * 0.4} cy={height * 0.55} r="2" fill={accent} />
      <circle cx={width * 0.58} cy={height * 0.55} r="2" fill={accent} />
      <circle cx={width * 0.79} cy={height * 0.55} r="2" fill={accent} />

      {/* Signal pulse — rides the path() above. Inline CSS var. */}
      <circle
        r="3"
        fill={accent}
        className="orn-signal-pulse"
        style={{ ['--orn-pulse-path' as string]: `path('${pulsePath}')` } as React.CSSProperties}
      />

      {/* Rails label */}
      <text x={width * 0.06} y={height * 0.92} fontFamily="JetBrains Mono, monospace" fontSize="8.5" fill="#5C5A52">
        Vcc ◯ GND ◯ GPIO 18 ▸ J3:7 ◯ 12V→relay coil
      </text>
    </svg>
  );
}
