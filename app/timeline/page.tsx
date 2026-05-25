import type { Metadata } from 'next';
import { TIMELINE_SORTED } from '@/lib/timeline';
import { TimelineEntryRow } from '@/components/timeline-entry';

export const metadata: Metadata = {
  title: 'Timeline — Wally Chang',
  description:
    'Every entry the homepage Bento draws from — projects, roles, races, coursework, milestones — sorted newest to oldest.',
};

/**
 * /timeline/ — flat-list view of every entry in lib/timeline.ts.
 *
 * The homepage Bento cherry-picks; this page shows the whole working
 * notebook in reverse-chronological order. Reuses TimelineEntryRow so
 * the row pattern stays consistent if the homepage ever lists rows again.
 */
export default function TimelinePage() {
  const first = TIMELINE_SORTED[0];
  const last = TIMELINE_SORTED[TIMELINE_SORTED.length - 1];
  const count = TIMELINE_SORTED.length;

  return (
    <div className="max-w-page mx-auto px-6 sm:px-10 pb-20">
      <section className="pt-16 sm:pt-24 pb-10 sm:pb-12 max-w-[920px]">
        <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-clay mb-5 flex items-center">
          <span className="font-serif italic text-clay mr-2 text-[16px] leading-none">¶</span>
          Timeline
        </div>
        <h1
          className="font-serif text-[40px] sm:text-[52px] @[1100px]:text-[60px] leading-[1.04] tracking-[-0.018em] text-ink mb-6 [text-wrap:balance]"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
        >
          The long view, by date.
        </h1>
        <p
          className="font-serif text-[18px] sm:text-[19px] leading-[1.55] text-ink-muted max-w-[700px] [text-wrap:pretty]"
          style={{ fontVariationSettings: '"opsz" 24, "wght" 400' }}
        >
          Every entry the homepage Bento draws from — projects, roles,
          races, coursework, milestones — sorted newest to oldest.
        </p>
        <div className="mt-7 font-mono text-[11px] tracking-meta uppercase text-ink-faint">
          {count} entries · {last.date} → {first.date}
        </div>
      </section>

      <section className="border-t border-paper-edge" aria-label="All entries, newest first">
        {TIMELINE_SORTED.map((entry) => (
          <TimelineEntryRow key={entry.sortDate + entry.title} entry={entry} />
        ))}
      </section>
    </div>
  );
}
