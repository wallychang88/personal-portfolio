/**
 * Status LED — green 8px dot with a 1.4s heartbeat, followed by a mono label.
 * Used in hardware marginalia ("● unlock", "● running").
 */
export function OrnLED({ label = 'unlock' }: { label?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.06em] text-ink-soft">
      <span
        aria-hidden="true"
        className="orn-led inline-block h-2 w-2 rounded-full"
        style={{ background: '#29C463', boxShadow: '0 0 6px rgba(41,196,99,0.55)' }}
      />
      {label}
    </span>
  );
}
