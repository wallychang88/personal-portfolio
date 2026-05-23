import Link from 'next/link';
import type { TimelineEntry } from '@/lib/timeline';
import { TagRow } from '@/components/tag';

/**
 * One row of the homepage timeline. Two columns:
 *  - left: date + small kind label
 *  - right: tags, title, hook, optional link
 *
 * On mobile the columns stack.
 */

export function TimelineEntryRow({ entry }: { entry: TimelineEntry }) {
  const titleClass =
    'font-serif text-[22px] sm:text-[24px] leading-[1.2] tracking-tight text-ink';

  // The whole right column is the link target if href is present.
  const inner = (
    <>
      <div className="mb-2.5">
        <TagRow tags={entry.tags} />
      </div>
      <h3 className={titleClass}>{entry.title}</h3>
      <p className="mt-2 text-[15px] leading-[1.6] text-ink-muted">
        {entry.hook}
      </p>
      {entry.href && (
        <div className="mt-3 font-serif italic text-[13px] text-ink-soft group-hover:text-ink transition-colors">
          {entry.kind === 'writing' ? 'Read the piece' : 'Read the writeup'} →
        </div>
      )}
    </>
  );

  return (
    <article className="grid grid-cols-[100px,1fr] sm:grid-cols-[140px,1fr] gap-6 sm:gap-10 py-7 border-b border-paper-edge last:border-b-0">
      <div className="pt-0.5">
        <div className="font-serif text-[15px] text-ink">{entry.date}</div>
        {entry.kindLabel && (
          <div className="mt-1 text-[11px] tracking-eyebrow uppercase text-ink-faint">
            {entry.kindLabel}
          </div>
        )}
        {!entry.kindLabel && (
          <div className="mt-1 text-[11px] tracking-eyebrow uppercase text-ink-faint capitalize">
            {entry.kind}
          </div>
        )}
      </div>
      <div className="min-w-0">
        {entry.href ? (
          entry.external ? (
            <a
              href={entry.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              {inner}
            </a>
          ) : (
            <Link href={entry.href} className="block group">
              {inner}
            </Link>
          )
        ) : (
          inner
        )}
      </div>
    </article>
  );
}
