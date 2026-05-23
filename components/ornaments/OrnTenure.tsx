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
  let x = 4;
  const barY = 30;
  const barH = 14;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
      <text x="0" y="11" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.06em" fill={color}>
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
              y={barY + barH + 14}
              textAnchor="middle"
              fontSize="9.5"
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
