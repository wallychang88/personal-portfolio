import { TIMELINE_SORTED } from '@/lib/timeline';
import { TimelineEntryRow } from '@/components/timeline-entry';

export default function HomePage() {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-10">
      {/* ============================================================
          Hero — wordmark eyebrow, big serif promise, short intro.
          Kept narrow (max-w-reading) so it reads like prose.
          ============================================================ */}
      <section className="pt-16 sm:pt-24 pb-20 sm:pb-28 max-w-reading">
        <div className="text-[11px] tracking-eyebrow uppercase text-ink-faint mb-6">
          A working notebook · 2022 — present
        </div>
        <h1 className="font-serif text-[44px] sm:text-[56px] leading-[1.05] tracking-tight text-ink mb-5">
          Things I’ve built, broken, and written down.
        </h1>
        <p className="text-[17px] leading-[1.65] text-ink-muted">
          I’m Wally — data scientist at Extend by day, founder of{' '}
          <a
            href="https://rodsmith.app"
            className="border-b border-ink-faint hover:border-ink transition-colors text-ink"
            target="_blank"
            rel="noopener noreferrer"
          >
            RodSmith
          </a>{' '}
          on nights and weekends, and a chronic finisher of small,
          opinionated hardware projects. This is the long-form version of
          what’s on my résumé — the parts where the interesting decisions
          actually happened.
        </p>
      </section>

      {/* ============================================================
          Timeline — the heart of the page.
          ============================================================ */}
      <section className="pb-24">
        <div className="flex items-baseline justify-between mb-4 pb-3 border-b border-ink/20">
          <h2 className="font-serif italic text-2xl text-ink">The timeline</h2>
          <div className="text-[11px] tracking-eyebrow uppercase text-ink-faint">
            Reverse chronological
          </div>
        </div>
        <div>
          {TIMELINE_SORTED.map((entry) => (
            <TimelineEntryRow key={entry.sortDate + entry.title} entry={entry} />
          ))}
        </div>
      </section>

      {/* ============================================================
          Coda — small, warm, signed.
          ============================================================ */}
      <section className="pb-16 max-w-reading">
        <p className="font-serif italic text-[19px] leading-[1.5] text-ink-muted">
          More to come, including a few writeups I’ve been sitting on too long.
          If something here is interesting, or wrong, or worth disagreeing
          with —{' '}
          <a
            href="mailto:wallychang88@gmail.com"
            className="text-ink border-b border-ink-faint hover:border-ink transition-colors"
          >
            wallychang88@gmail.com
          </a>
          .
        </p>
      </section>
    </div>
  );
}
