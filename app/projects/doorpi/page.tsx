import type { Metadata } from 'next';
import Link from 'next/link';
import { TagRow } from '@/components/tag';
import { OrnLED, OrnRevStamp, OrnSchematic } from '@/components/ornaments';

export const metadata: Metadata = {
  title: 'doorpi — Wally Chang',
  description:
    'doorpi v3 — a face-ID door unlock with a peace-sign verification step. Pi Zero W + ESP32 + MediaPipe. Long-form writeup in progress.',
};

/**
 * doorpi project deep-dive.
 *
 * Per PORT-PLAN Pass 7 + AUDIT-2026-05-21.md: ship with H1 + dek + FIG. 01
 * schematic + placeholder body. The round-3 design canvas's V4L2 saga,
 * "1,847 unlocks", $43 board, glass-vestibule-with-buzzer-and-guitar
 * origin, and ae.py code block are all invented. They get added back
 * (or rewritten from scratch) when Wally writes the real narrative.
 *
 * What WALLY.md actually confirms: v3 shipped Apr 2026 · Face-ID +
 * peace-sign confirmation · running 24/7 on doorpihost. That's the
 * marginalia content too — nothing else.
 *
 * Layout: container-query grid. Under @[1024px] a single column stack
 * (article → marginalia rail beneath). Above, 1fr 260px side-by-side.
 */

export default function DoorpiPage() {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-10 pb-20">
      <BackLink />

      <ArticleHeader />

      <Hero />

      <div className="grid grid-cols-1 @[1024px]:grid-cols-[1fr_260px] gap-10 @[1024px]:gap-14 items-start">
        <ArticleBody />
        <MarginaliaRail />
      </div>
    </div>
  );
}

function BackLink() {
  return (
    <div className="pt-10 pb-2">
      <Link
        href="/"
        className="font-mono text-xs tracking-meta text-ink-soft hover:text-ink transition-colors"
      >
        ← Index
      </Link>
    </div>
  );
}

function ArticleHeader() {
  return (
    <header className="relative pt-12 pb-10">
      <div className="absolute top-12 right-0 hidden @[768px]:flex flex-col items-end gap-2.5">
        <OrnRevStamp rev="v3">REV</OrnRevStamp>
        <OrnLED label="unlock · operational" />
      </div>

      <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-rust mb-4">
        Project · Shipped · April 2026
      </div>
      <h1
        className="font-serif text-[40px] sm:text-[52px] @[1100px]:text-[64px] leading-[1.03] tracking-[-0.02em] text-ink mb-4 [text-wrap:balance] max-w-[980px]"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
      >
        doorpi — a door that knows my face and waits for a peace sign.
      </h1>
      <p
        className="font-serif italic text-[18px] sm:text-[22px] leading-[1.4] text-ink-soft mb-6 [text-wrap:balance] max-w-[820px]"
        style={{ fontVariationSettings: '"opsz" 36, "wght" 400' }}
      >
        Pi Zero + ESP32 + MediaPipe. A face-match unlock with a peace-sign
        verification step before the relay fires.
      </p>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
        <div className="font-mono text-[11.5px] tracking-meta text-ink-soft">
          Solo build · running 24/7 on doorpihost
        </div>
        <TagRow tags={['Hardware', 'Computer Vision', 'Python']} cat="rust" />
      </div>

      {/* Inline rev stamp + LED for narrow viewports — the absolute-positioned
          ones above hide under @[768px]. */}
      <div className="mt-6 flex items-center gap-3.5 @[768px]:hidden">
        <OrnRevStamp rev="v3">REV</OrnRevStamp>
        <OrnLED label="unlock" />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="mb-12 rounded-md border border-paper-edge bg-paper-deep px-5 py-6 sm:px-8 sm:py-7">
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <div className="font-mono text-[11px] tracking-[0.18em] uppercase text-rust">
          Fig. 01 · system schematic · v3
        </div>
        <div className="font-mono text-[11px] text-ink-soft">
          camera → Pi → MediaPipe → ESP32 → 12V latch
        </div>
      </div>
      <OrnSchematic width={1130} height={210} delay={1} />
    </section>
  );
}

function ArticleBody() {
  return (
    <article
      className="font-serif text-[17px] sm:text-[18px] leading-[1.65] text-ink-muted [text-wrap:pretty] max-w-[640px]"
      style={{ fontVariationSettings: '"opsz" 18, "wght" 400' }}
    >
      <p>
        doorpi v3 shipped in April 2026. It is the third revision of a
        face-recognition + peace-sign door unlock that runs continuously on a
        small box behind a fixture in my apartment lobby. Pi Zero W on the
        capture side, ESP32 on the strike-plate side, the latch in the middle.
      </p>
      <p>
        The peace sign is the part I am most proud of. It is the one-bit
        confirmation that the unlock was on purpose — the door does not open
        because my face happened to appear in the frame, only because I
        deliberately said it should.
      </p>
      <p
        className="mt-10 pt-6 border-t border-paper-edge font-mono text-[12px] not-italic text-ink-faint tracking-meta [text-wrap:balance]"
        style={{ fontVariationSettings: 'normal' }}
      >
        Long-form writeup in progress — the real notes on the camera-driver
        fight, the auto-exposure rewrite, and the peace-sign stability gate
        land in a later revision.
      </p>
    </article>
  );
}

function MarginaliaRail() {
  return (
    <aside className="@[1024px]:pt-2 space-y-4">
      <div className="rounded-md border border-paper-edge bg-paper-deep px-4 py-3.5">
        <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-rust mb-2.5">
          Build · current
        </div>
        <div className="flex flex-col gap-2.5">
          <OrnRevStamp rev="v3">REV</OrnRevStamp>
          <OrnLED label="unlock" />
        </div>
        <div className="mt-3 font-mono text-[10.5px] leading-[1.55] text-ink-soft">
          shipped · apr 2026<br />
          running · 24/7
        </div>
      </div>
    </aside>
  );
}
