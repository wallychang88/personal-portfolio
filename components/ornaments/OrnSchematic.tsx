import { CAT_HEX } from './catClass';

/**
 * Full hardware schematic — Camera → Pi Zero W → MediaPipe → ESP32 → 12V
 * relay latch. A signal pulse rides the rust trace via offset-path,
 * tracing the same geometry as the drawn connection lines.
 *
 * Layout: Camera sits directly above Pi (vertical feed line, no L-shaped
 * routing). The processing chain runs left-to-right on a shared bus.
 * Every label is anchored to its box's interior so no text ever crosses
 * a connection line.
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

  // Box geometry (fractions of width/height). Camera sits centered over Pi.
  const pi    = { x1: 0.06, x2: 0.22, y1: 0.46, y2: 0.78 };
  const cam   = { x1: 0.08, x2: 0.20, y1: 0.10, y2: 0.32 };
  const mp    = { x1: 0.28, x2: 0.46, y1: 0.46, y2: 0.78 };
  const esp   = { x1: 0.52, x2: 0.70, y1: 0.46, y2: 0.78 };
  const relay = { x1: 0.76, x2: 0.94, y1: 0.46, y2: 0.78 };

  const busY  = (pi.y1 + pi.y2) / 2;          // 0.62 — bus through box centers
  const camX  = (cam.x1 + cam.x2) / 2;        // 0.14
  const piX   = (pi.x1 + pi.x2) / 2;          // 0.14

  // Connection paths — same geometry the pulse will retrace.
  const camToPi  = `M${width * camX},${height * cam.y2} L${width * piX},${height * pi.y1}`;
  const piToMp   = `M${width * pi.x2},${height * busY} L${width * mp.x1},${height * busY}`;
  const mpToEsp  = `M${width * mp.x2},${height * busY} L${width * esp.x1},${height * busY}`;
  const espToRel = `M${width * esp.x2},${height * busY} L${width * relay.x1},${height * busY}`;

  // Pulse retraces the full signal path camera → pi → mediapipe → esp32 → relay.
  const pulsePath =
    `M${width * camX},${height * cam.y2} ` +
    `L${width * piX},${height * pi.y1} ` +
    `L${width * piX},${height * busY} ` +
    `L${width * relay.x1},${height * busY}`;

  // Helper: render one labelled box. Title sits above the box, two
  // sublines stack inside it from the top.
  const Box = ({ box, title, sub1, sub2 }: {
    box: { x1: number; x2: number; y1: number; y2: number };
    title: string;
    sub1?: string;
    sub2?: string;
  }) => {
    const bx = width * box.x1;
    const by = height * box.y1;
    const bw = width * (box.x2 - box.x1);
    const bh = height * (box.y2 - box.y1);
    return (
      <g>
        <rect x={bx} y={by} width={bw} height={bh} fill="none" stroke={color} strokeWidth="1" />
        <text x={bx + 5} y={by - 6} fontFamily="JetBrains Mono, monospace" fontSize="10" fill={color}>
          {title}
        </text>
        {sub1 && (
          <text x={bx + 8} y={by + 16} fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#5C5A52">
            {sub1}
          </text>
        )}
        {sub2 && (
          <text x={bx + 8} y={by + 30} fontFamily="JetBrains Mono, monospace" fontSize="9" fill="#5C5A52">
            {sub2}
          </text>
        )}
      </g>
    );
  };

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" role="img" aria-label="doorpi system schematic">
      <Box box={cam}   title="Camera v2" sub1="1080p · 30fps" />
      <Box box={pi}    title="Pi Zero W" sub1="/dev/video0" sub2="GPIO 18" />
      <Box box={mp}    title="MediaPipe" sub1="hands · 0.6"  sub2="face_match" />
      <Box box={esp}   title="ESP32"     sub1="J3:7"         sub2="UART · 115200" />
      <Box box={relay} title="Relay"     sub1="12V latch" />

      {/* Connection lines drawn in sequence. */}
      <path className={`orn-draw d${delay}`} d={camToPi} fill="none" stroke={accent} strokeWidth="1.4" />
      <path className={`orn-draw d${Math.min(delay + 1, 5)}`} d={piToMp} fill="none" stroke={accent} strokeWidth="1.4" />
      <path className={`orn-draw d${Math.min(delay + 2, 5)}`} d={mpToEsp} fill="none" stroke={accent} strokeWidth="1.4" />
      <path className={`orn-draw d${Math.min(delay + 3, 5)}`} d={espToRel} fill="none" stroke={accent} strokeWidth="1.4" />

      {/* Junction dots at every box edge the pulse touches. */}
      <circle cx={width * camX}    cy={height * cam.y2} r="2" fill={accent} />
      <circle cx={width * piX}     cy={height * pi.y1}  r="2" fill={accent} />
      <circle cx={width * pi.x2}   cy={height * busY}   r="2" fill={accent} />
      <circle cx={width * mp.x1}   cy={height * busY}   r="2" fill={accent} />
      <circle cx={width * mp.x2}   cy={height * busY}   r="2" fill={accent} />
      <circle cx={width * esp.x1}  cy={height * busY}   r="2" fill={accent} />
      <circle cx={width * esp.x2}  cy={height * busY}   r="2" fill={accent} />
      <circle cx={width * relay.x1} cy={height * busY}  r="2" fill={accent} />

      {/* Signal pulse — rides the same geometry. */}
      <circle
        r="3"
        fill={accent}
        className="orn-signal-pulse"
        style={{ '--orn-pulse-path': `path('${pulsePath}')` } as React.CSSProperties}
      />

      {/* Rails label at the bottom — well below the bus line. */}
      <text x={width * 0.06} y={height * 0.95} fontFamily="JetBrains Mono, monospace" fontSize="8.5" fill="#5C5A52">
        Vcc ◯ GND ◯ GPIO 18 ▸ J3:7 ◯ 12V→relay coil
      </text>
    </svg>
  );
}
