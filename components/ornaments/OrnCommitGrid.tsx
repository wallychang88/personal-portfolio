import { CAT_HEX, type TagCategory } from './catClass';

/**
 * 22×4 commit-density grid (GitHub-style contributions strip). Cell
 * intensity is deterministic per index so it renders the same on
 * every page load (no hydration drift).
 */
export function OrnCommitGrid({
  width = 240,
  height = 64,
  delay = 1,
  cat = 'slate',
  label = 'COMMITS · 22 WK',
}: {
  width?: number;
  height?: number;
  delay?: number;
  cat?: TagCategory;
  label?: string;
}) {
  const color = CAT_HEX[cat];
  const cols = 22;
  const rows = 4;
  const cw = (width - 8) / cols - 1.4;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block" aria-hidden="true">
      <text x="0" y="11" fontSize="9.5" fontFamily="JetBrains Mono, monospace" letterSpacing="0.06em" fill={color}>
        {label}
      </text>
      {Array.from({ length: cols * rows }).map((_, i) => {
        const c = i % cols;
        const r = Math.floor(i / cols);
        const v = Math.max(0, Math.min(1, Math.sin(i * 0.71) * 0.4 + Math.sin(i * 0.21) * 0.3 + 0.35));
        return (
          <rect
            key={i}
            className="orn-bar-grow"
            x={4 + c * (cw + 1.4)}
            y={20 + r * (cw + 1.4)}
            width={cw}
            height={cw}
            fill={color}
            opacity={0.12 + v * 0.75}
            style={{ animationDelay: `${delay * 0.12 + i * 0.01}s`, transformOrigin: 'center' }}
          />
        );
      })}
    </svg>
  );
}
