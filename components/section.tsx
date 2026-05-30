import { Children, isValidElement, type ReactNode } from 'react';

/**
 * <Section> — accented page-level section used in long-form content
 * pages (about, project deep-dives). Renders a colored top-rule,
 * eyebrow + symbol, h2 heading, optional top-right ornament, and the
 * children inside an editorial-prose wrapper.
 *
 * Accent must be one of the named palette tokens (sage, rust, slate,
 * honey, clay). Tailwind's content scanner needs to see each accent
 * class literally, so the mapping below uses string literals — don't
 * refactor into `border-${accent}` etc., it'll purge to nothing.
 *
 * The optional top-right ornament is passed via composition, not a
 * prop. Wrap it in <SectionOrnament> as a child of <Section> — Section
 * lifts it out into its header. This is the JSX shape MDX understands
 * (props with JSX expressions aren't reliably parsed when loaded via
 * next-mdx-remote, since identifiers in expression position aren't
 * scoped via the components map).
 */

export type SectionAccent = 'sage' | 'rust' | 'slate' | 'honey' | 'clay';

interface SectionProps {
  accent: SectionAccent;
  /** Glyph rendered before the eyebrow text — e.g. "◆", "✤", "▣". */
  symbol?: string;
  /** Small-caps label above the heading, e.g. "Sweat identity". */
  eyebrow: string;
  /** Section h2. */
  heading: string;
  /** Optional anchor id for in-page links. */
  anchor?: string;
  children: ReactNode;
}

/**
 * <SectionOrnament> — slot marker. Children of <Section> wrapped in
 * this component get lifted to the section's top-right header slot.
 * Anything else stays in the body prose flow.
 */
export function SectionOrnament({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
// displayName lets Section identify these children without a brittle
// reference equality check (which breaks when MDX re-resolves via the
// components map).
SectionOrnament.displayName = 'SectionOrnament';

const ACCENT_RULE: Record<SectionAccent, string> = {
  sage: 'border-sage',
  rust: 'border-rust',
  slate: 'border-slate',
  honey: 'border-honey',
  clay: 'border-clay',
};

const ACCENT_TEXT: Record<SectionAccent, string> = {
  sage: 'text-sage',
  rust: 'text-rust',
  slate: 'text-slate',
  honey: 'text-honey',
  clay: 'text-clay',
};

export function Section({
  accent,
  symbol,
  eyebrow,
  heading,
  anchor,
  children,
}: SectionProps) {
  const childArray = Children.toArray(children);
  const ornamentChildren: ReactNode[] = [];
  const bodyChildren: ReactNode[] = [];
  for (const child of childArray) {
    if (
      isValidElement(child) &&
      typeof child.type !== 'string' &&
      'displayName' in child.type &&
      (child.type as { displayName?: string }).displayName === 'SectionOrnament'
    ) {
      ornamentChildren.push(child);
    } else {
      bodyChildren.push(child);
    }
  }

  return (
    <section
      className={`relative pt-9 pb-14 border-t-4 ${ACCENT_RULE[accent]}`}
      id={anchor}
    >
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <div
            className={`text-[11px] font-sans font-semibold tracking-eyebrow uppercase ${ACCENT_TEXT[accent]} mb-3 flex items-center`}
          >
            {symbol ? <span className="mr-2">{symbol}</span> : null}
            {eyebrow}
          </div>
          <h2
            className="font-serif text-[28px] sm:text-[34px] @[1100px]:text-[36px] leading-[1.08] tracking-[-0.014em] text-ink [text-wrap:balance] max-w-[820px]"
            style={{ fontVariationSettings: '"opsz" 60, "wght" 400' }}
          >
            {heading}
          </h2>
        </div>
        {ornamentChildren.length > 0 ? <div>{ornamentChildren}</div> : null}
      </div>

      <div
        className="font-serif text-[17px] sm:text-[18px] leading-[1.7] text-ink-muted max-w-[680px] [text-wrap:pretty] space-y-5"
        style={{ fontVariationSettings: '"opsz" 18, "wght" 400' }}
      >
        {bodyChildren}
      </div>
    </section>
  );
}

/**
 * <Prose> — wrapper for editorial prose blocks that aren't inside a
 * Section (e.g. the intro paragraphs at the top of /about/). Same
 * typography as Section's body wrapper.
 */
export function Prose({ children }: { children: ReactNode }) {
  return (
    <div
      className="font-serif text-[17px] sm:text-[18px] leading-[1.7] text-ink-muted max-w-[680px] [text-wrap:pretty] space-y-5"
      style={{ fontVariationSettings: '"opsz" 18, "wght" 400' }}
    >
      {children}
    </div>
  );
}

const ACCENT_CALLOUT: Record<SectionAccent, string> = {
  sage: 'border-sage/30 bg-sage/[0.07] text-sage',
  rust: 'border-rust/30 bg-rust/[0.07] text-rust',
  slate: 'border-slate/30 bg-slate/[0.07] text-slate',
  honey: 'border-honey/30 bg-honey/[0.07] text-honey',
  clay: 'border-clay/30 bg-clay/[0.07] text-clay',
};

/**
 * <Callout> — accented call-out box for in-section summaries or
 * visualizations (e.g. an OrnEndurance timeline ribbon under an
 * endurance section). Inherits the section's accent so reading
 * stays consistent.
 */
export function Callout({
  accent,
  label,
  children,
}: {
  accent: SectionAccent;
  label?: string;
  children: ReactNode;
}) {
  return (
    <div className={`mt-8 px-5 py-4 rounded-md border ${ACCENT_CALLOUT[accent]}`}>
      {label ? (
        <div className="font-mono text-[10.5px] tracking-stat uppercase mb-2.5">
          {label}
        </div>
      ) : null}
      {children}
    </div>
  );
}
