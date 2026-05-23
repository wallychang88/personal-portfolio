/**
 * Stat panel — 4-up grid with top + bottom hairlines and a vertical
 * hairline between each cell. Mirrors the `.uni .stat-panel` recipe in
 * _unified.jsx (visual reference only). Used for trophy splits on
 * /endurance/ + bake stats on /kitchen/.
 *
 * The label is mono uppercase (eyebrow), the value is display-weight
 * Fraunces (opsz 36 / wght 500), the sub is mono.
 *
 * On narrow viewports the grid collapses to 2 columns and the middle
 * vertical hairline is hidden.
 */

export interface StatItem {
  label: string;
  value: string;
  /** Optional mono annotation under the value. */
  sub?: string;
}

export function StatPanel({ items }: { items: StatItem[] }) {
  return (
    <dl
      className={
        'my-6 grid grid-cols-2 sm:grid-cols-4 ' +
        'border-y border-ink/[0.18]'
      }
    >
      {items.map((item, i) => (
        <div
          key={item.label}
          className={
            'px-4 py-3.5 sm:px-[18px] sm:py-3.5 ' +
            // Vertical hairline between cells; last cell + the rightmost
            // in 2-col mode skip it.
            'sm:border-r sm:border-ink/[0.12] sm:last:border-r-0 ' +
            (i % 2 === 1 ? 'border-r-0 ' : 'border-r border-ink/[0.12] ') +
            (i % 2 === 1 ? '' : '')
          }
        >
          <dt className="font-mono text-[10.5px] tracking-stat uppercase text-ink-faint">
            {item.label}
          </dt>
          <dd
            className="mt-1.5 font-serif text-[26px] leading-[1.05] tracking-tight text-ink"
            style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
          >
            {item.value}
          </dd>
          {item.sub && (
            <div className="mt-1 font-mono text-[10.5px] text-ink-soft">{item.sub}</div>
          )}
        </div>
      ))}
    </dl>
  );
}
