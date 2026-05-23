/**
 * Pull quote — Fraunces italic, clay 2px left rule, with a hairline
 * underline that draws left-to-right on mount.
 */
export function OrnPullQuote({
  children,
  attribution,
}: {
  children: React.ReactNode;
  attribution?: string;
}) {
  return (
    <figure className="my-5">
      <blockquote className="border-l-2 border-clay pl-[18px] py-1.5 font-serif italic text-[20px] leading-[1.45] text-ink-muted [text-wrap:pretty] max-w-[580px]">
        {children}
        <span aria-hidden="true" className="orn-pq-rule mt-3.5" />
      </blockquote>
      {attribution && (
        <figcaption className="mt-1 font-mono text-[10.5px] tracking-[0.06em] text-ink-faint">
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}
