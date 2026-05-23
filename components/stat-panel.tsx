/**
 * Stat panel — the data block that sits beside or below an editorial
 * caption on the trophy-activity blocks. Each item is a small label +
 * large value; labels are sentence case, values are display-weight
 * serif so they have presence.
 */

export interface StatItem {
  label: string;
  value: string;
  /** Optional small annotation under the value, e.g. "M18-24 · div rank 39". */
  note?: string;
}

export function StatPanel({ items }: { items: StatItem[] }) {
  return (
    <dl className="mt-6 mb-2 grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-5 border-t border-paper-edge pt-6">
      {items.map((item) => (
        <div key={item.label} className="min-w-0">
          <dt className="text-[11px] tracking-eyebrow uppercase text-ink-faint">
            {item.label}
          </dt>
          <dd className="mt-1.5 font-serif text-[26px] sm:text-[28px] leading-[1.05] tracking-tight text-ink">
            {item.value}
          </dd>
          {item.note && (
            <div className="mt-1 text-[11px] text-ink-soft">{item.note}</div>
          )}
        </div>
      ))}
    </dl>
  );
}
