import { CAT_HEX, type TagCategory } from './catClass';

export interface TenureItem {
  label: string;
  /** Relative weight; bars are sized by `frac / sum(frac)`. */
  frac: number;
}

/**
 * Segmented tenure bar — one block per role, sized by `frac`. The
 * trailing block is fully opaque (current role); earlier blocks fade
 * back. Mono labels sit under each segment.
 */
export function OrnTenure({
  width = 240,
  height = 64,
  delay = 1,
  cat = 'slate',
  label = 'ROLE TENURE · YR',
  items,
}: {
  width?: number;
  height?: number;
  delay?: number;
  cat?: TagCategory;
  label?: string;
  items: TenureItem[];
}) {
  const color = CAT_HEX[cat];
  const total = items.reduce((s, i) => s + i.frac, 0) || 1;
  // Layout pinned to the available height: kicker (top), bar, segment
  // labels (bottom). Each gets a clear band — no clipping or overlap
  // even at the smallest height we ship (56).
  const kickerY = 11;
  const barH = 12;
  const labelGap = 4;        // gap between bar bottom and label top
  const labelFont = 9.5;
  const labelLine = labelFont + 2;
  const barY = height - labelLine - labelGap - barH;
  let x = 4;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
      <text x="0" y={kickerY} fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.06em" fill={color}>
        {label}
      </text>
      {items.map((it, i) => {
        const w = (it.frac / total) * (width - 8);
        const elements = (
          <g key={i}>
            <rect
              className="orn-bar-grow"
              x={x}
              y={barY}
              width={w}
              height={barH}
              fill={color}
              opacity={i === items.length - 1 ? 1 : 0.4 + i * 0.15}
              style={{ animationDelay: `${delay * 0.12 + i * 0.12}s`, transformOrigin: `${x}px ${barY + barH}px` }}
            />
            <text
              x={x + w / 2}
              y={barY + barH + labelGap + labelFont}
              textAnchor="middle"
              fontSize={labelFont}
              fontFamily="JetBrains Mono, monospace"
              fill={color}
            >
              {it.label}
            </text>
          </g>
        );
        x += w + 2;
        return elements;
      })}
    </svg>
  );
}
