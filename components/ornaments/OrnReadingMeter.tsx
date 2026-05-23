/**
 * Reading-progress meter — a thin clay bar with a percentage label.
 * Static (no scroll wiring); used in /writing/ row eyebrows.
 */
export function OrnReadingMeter({
  pct = 30,
  width = 80,
}: {
  pct?: number;
  width?: number;
}) {
  const clamped = Math.max(0, Math.min(100, pct));
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] text-ink-faint">
      <span
        className="relative inline-block h-[3px]"
        style={{ width, background: 'rgba(28,27,23,0.10)' }}
      >
        <span
          className="absolute inset-y-0 left-0 bg-clay"
          style={{ width: `${clamped}%` }}
        />
      </span>
      {clamped}%
    </span>
  );
}
