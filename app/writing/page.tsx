import type { Metadata } from 'next';
import { ESSAYS_SORTED } from '@/lib/essays';
import { getWritingPage } from '@/lib/writing-page';

const writing = getWritingPage();

export const metadata: Metadata = {
  title: writing.metaTitle,
  description: writing.metaDescription,
};

/**
 * /writing/ — essay index.
 *
 * v1 ships with an empty essay list and a voiced placeholder (per
 * PORT-PLAN Pass 7 + WALLY.md open Q #5 — first essay is the gating
 * piece). When lib/essays.ts grows entries:
 *   • each essay gets an `app/writing/[slug]/page.mdx`
 *   • dynamicParams = false + generateStaticParams() on the [slug]
 *   • filter chips ride above the row list with the categories
 *     actually present (drop the "Kitchen" chip per AUDIT —
 *     /kitchen/ has its own page)
 *
 * Hero + empty-state copy live in content/writing.mdx, edited via
 * /admin/ → Pages → Writing.
 */
export default function WritingPage() {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-10 pb-20">
      <Hero />
      {ESSAYS_SORTED.length === 0 ? <EmptyState /> : <EssayList />}
    </div>
  );
}

function Hero() {
  return (
    <section className="pt-16 sm:pt-24 pb-10 sm:pb-12 max-w-[920px]">
      <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-clay mb-5 flex items-center">
        <span className="font-serif italic text-clay mr-2 text-[16px] leading-none">¶</span>
        {writing.eyebrow}
      </div>
      <h1
        className="font-serif text-[40px] sm:text-[52px] @[1100px]:text-[60px] leading-[1.04] tracking-[-0.018em] text-ink mb-6 [text-wrap:balance]"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
      >
        {writing.heading}
      </h1>
      <p
        className="font-serif text-[18px] sm:text-[19px] leading-[1.55] text-ink-muted max-w-[700px] [text-wrap:pretty]"
        style={{ fontVariationSettings: '"opsz" 24, "wght" 400' }}
      >
        {writing.dek}
      </p>
    </section>
  );
}

function EmptyState() {
  return (
    <section className="mt-2 pt-10 border-t border-paper-edge">
      <div className="max-w-[720px]">
        <p className="font-serif italic text-[18px] sm:text-[20px] leading-[1.5] text-ink-muted [text-wrap:pretty]">
          {writing.emptyBody}
        </p>
        <p className="mt-4 font-mono text-[11px] tracking-meta uppercase text-ink-faint">
          {writing.emptyCaption}
        </p>
      </div>
    </section>
  );
}

function EssayList() {
  // Real rendering lands when ESSAYS has entries — see the comment block at
  // the top of this file for the wire-up checklist.
  return null;
}
