import { Children, isValidElement, type ReactNode } from 'react';

/**
 * Composable building blocks for project deep-dive MDX bodies.
 *
 * - <Figure> — labelled figure box for hero schematics + diagrams.
 * - <ProjectColumns> — two-column grid (prose left, marginalia rail
 *   right) that collapses to a stack under @[1024px]. Uses the same
 *   slot pattern as <Section>: children wrapped in <ProjectMarginalia>
 *   get lifted to the rail column, everything else flows into the
 *   prose column.
 * - <ProjectMarginalia> — slot marker.
 * - <MarginaliaCard> — single card in the rail (label + children).
 *
 * The composition pattern (children-via-displayName, not JSX-in-props)
 * is the same as <Section>. See components/section.tsx for the reason
 * — next-mdx-remote/rsc can't resolve identifiers inside JSX prop
 * expressions through the components map, so we lift children instead.
 */

export function Figure({
  label,
  caption,
  children,
}: {
  label: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <section className="mb-12 rounded-md border border-paper-edge bg-paper-deep px-5 py-6 sm:px-8 sm:py-7">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-rust">
          {label}
        </div>
        {caption ? (
          <div className="font-mono text-[11px] text-ink-soft">{caption}</div>
        ) : null}
      </div>
      {children}
    </section>
  );
}

/**
 * Slot marker for the marginalia rail. Children placed inside this in
 * MDX get lifted to the right rail of <ProjectColumns>.
 */
export function ProjectMarginalia({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
ProjectMarginalia.displayName = 'ProjectMarginalia';

export function ProjectColumns({ children }: { children: ReactNode }) {
  const railChildren: ReactNode[] = [];
  const proseChildren: ReactNode[] = [];

  for (const child of Children.toArray(children)) {
    if (
      isValidElement(child) &&
      typeof child.type !== 'string' &&
      'displayName' in child.type &&
      (child.type as { displayName?: string }).displayName ===
        'ProjectMarginalia'
    ) {
      railChildren.push(child);
    } else {
      proseChildren.push(child);
    }
  }

  return (
    <div className="grid grid-cols-1 @[1024px]:grid-cols-[1fr_260px] gap-10 @[1024px]:gap-14 items-start">
      <article
        className="font-serif text-[17px] sm:text-[18px] leading-[1.65] text-ink-muted [text-wrap:pretty] max-w-[640px] space-y-5"
        style={{ fontVariationSettings: '"opsz" 18, "wght" 400' }}
      >
        {proseChildren}
      </article>
      {railChildren.length > 0 ? (
        <aside className="@[1024px]:pt-2 space-y-4">{railChildren}</aside>
      ) : null}
    </div>
  );
}

export function MarginaliaCard({
  label,
  caption,
  children,
}: {
  label: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-md border border-paper-edge bg-paper-deep px-4 py-3.5">
      <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-rust mb-2.5">
        {label}
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
      {caption ? (
        <div className="mt-3 font-mono text-[10.5px] leading-[1.55] text-ink-soft whitespace-pre-line">
          {caption}
        </div>
      ) : null}
    </div>
  );
}

/**
 * Endnote paragraph styled with the meta mono treatment + top hairline.
 * Used at the end of a project body to mark "this is the bottom".
 */
export function EndNote({ children }: { children: ReactNode }) {
  return (
    <p
      className="mt-10 pt-6 border-t border-paper-edge font-mono text-[12px] not-italic text-ink-faint tracking-meta [text-wrap:balance]"
      style={{ fontVariationSettings: 'normal' }}
    >
      {children}
    </p>
  );
}
