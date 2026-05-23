/**
 * Honey thumbprint stamp — a dashed border with a rotated kicker. Used to
 * mark kitchen batches: "✤ BATCH 41".
 */
export function OrnThumbStamp({ children = 'BATCH 41' }: { children?: React.ReactNode }) {
  return (
    <span
      className={
        'inline-flex items-center gap-1.5 ' +
        'px-2.5 py-0.5 border-[1.5px] border-dashed border-honey text-honey ' +
        'font-mono text-[11px] tracking-[0.1em] uppercase ' +
        'rotate-[1.5deg]'
      }
    >
      <span aria-hidden="true">✤</span>
      {children}
    </span>
  );
}
