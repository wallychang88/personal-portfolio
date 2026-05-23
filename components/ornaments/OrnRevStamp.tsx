/**
 * Rust-bordered REV stamp. Rotated -2deg at rest; on hover the whole stamp
 * flips on its Y axis. Used as marginalia + tile ornament for hardware.
 */
export function OrnRevStamp({
  rev = '3.2',
  children = 'REV',
}: {
  rev?: string;
  children?: React.ReactNode;
}) {
  return (
    <span
      className={
        'orn-rev-stamp inline-flex items-center gap-1.5 ' +
        'px-2.5 py-1 border-[1.5px] border-rust text-rust ' +
        'font-mono text-[11px] tracking-[0.12em] uppercase'
      }
    >
      <span aria-hidden="true" className="opacity-80">✱</span>
      {children} {rev}
    </span>
  );
}
