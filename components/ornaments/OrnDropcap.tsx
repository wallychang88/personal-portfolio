/**
 * Drop-cap stamp — a 36px clay-bordered circle with a single letter inside.
 * NOT the float-style `::first-letter` drop cap (that's `.drop-cap` in
 * globals.css). This is the stamp ornament used as a decorative kicker.
 */
export function OrnDropcap({ letter = 'T' }: { letter?: string }) {
  return (
    <span
      aria-hidden="true"
      className={
        'orn-dropcap-stamp inline-flex items-center justify-center ' +
        'h-9 w-9 rounded-full border-[1.5px] border-clay text-clay ' +
        'font-serif text-lg font-semibold'
      }
    >
      {letter}
    </span>
  );
}
