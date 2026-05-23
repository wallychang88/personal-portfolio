import type { Metadata } from 'next';
import Link from 'next/link';
import { PhotoStrip } from '@/components/photo-strip';
import { StatPanel } from '@/components/stat-panel';
import {
  ContourBackground,
  OrnCompassRose,
  RouteIronman,
  RouteTioga,
  RouteWhitney,
} from '@/components/ornaments';
import { GALLERIES, type GalleryId } from '@/lib/galleries';
import { TROPHIES, type Trophy } from '@/lib/trophies';

export const metadata: Metadata = {
  title: 'Endurance — Wally Chang',
  description:
    'Three trophy days from the field atlas — Mount Whitney, Tioga Road, and IRONMAN 70.3 Indian Wells.',
};

const GALLERY_FOR: Record<Trophy['slug'], GalleryId> = {
  whitney: 'endurance_whitney',
  tioga:   'endurance_tioga',
  ironman: 'endurance_ironman',
};

const ROUTE_FOR: Record<Trophy['slug'], React.ReactNode> = {
  whitney: <RouteWhitney />,
  tioga:   <RouteTioga />,
  ironman: <RouteIronman />,
};

export default function EndurancePage() {
  return (
    <div className="relative">
      <ContourBackground width={1280} height={2800} />

      <div className="relative z-10 max-w-page mx-auto px-6 sm:px-10 pb-20">
        <Masthead />
        <Hero />
        {TROPHIES.map((trophy) => (
          <TrophyBlock key={trophy.slug} trophy={trophy} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Page-local pieces.
   ───────────────────────────────────────────────────────────────── */

function Masthead() {
  return (
    <header className="pt-10 pb-5 mb-2 flex items-start justify-between border-b border-paper-edge">
      <div>
        <div className="font-mono text-[10.5px] tracking-[0.18em] uppercase text-sage mb-1">
          Field atlas · vol. III
        </div>
        <Link
          href="/"
          className="font-serif text-[22px] font-medium tracking-[-0.005em] text-ink hover:opacity-70 transition-opacity"
          style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
        >
          Wally Chang
        </Link>
      </div>
      <div className="hidden @[768px]:block">
        <OrnCompassRose size={68} accent="rust" />
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="pt-12 pb-12 sm:pt-14 sm:pb-16 max-w-[960px]">
      <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-sage mb-5">
        Trophy days
      </div>
      <h1
        className="font-serif text-[44px] sm:text-[56px] @[1100px]:text-[68px] leading-[1.02] tracking-[-0.02em] text-ink mb-6 [text-wrap:balance]"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
      >
        The routes that named the years.
      </h1>
      <p
        className="font-serif text-[18px] sm:text-[20px] leading-[1.55] text-ink-muted max-w-[720px] [text-wrap:pretty]"
        style={{ fontVariationSettings: '"opsz" 24, "wght" 400' }}
      >
        Some days you finish a route and the year hangs off it for months —
        every other day in the calendar becomes &ldquo;before that&rdquo; or
        &ldquo;after that.&rdquo; This is the file of those. Three trophies,
        with maps, numbers, and the parts of the story that won&rsquo;t fit
        on a Strava page.
      </p>
    </section>
  );
}

function TrophyBlock({ trophy }: { trophy: Trophy }) {
  const photos = GALLERIES[GALLERY_FOR[trophy.slug]];
  return (
    <article id={trophy.slug} className="relative scroll-mt-24 mb-20 last:mb-0">
      <div className="absolute top-0 right-0 font-mono text-[11px] tracking-meta text-ink-soft">
        {trophy.coords}
      </div>

      <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-sage mb-3.5">
        {trophy.kicker}
      </div>

      <h2
        className="font-serif text-[36px] sm:text-[44px] @[1100px]:text-[56px] leading-[1.04] tracking-[-0.018em] text-ink mb-3 [text-wrap:balance] max-w-[920px]"
        style={{ fontVariationSettings: '"opsz" 96, "wght" 400' }}
      >
        {trophy.title}
      </h2>
      <div
        className="font-serif italic text-[18px] sm:text-[22px] text-ink-soft mb-8 [text-wrap:balance] max-w-[720px]"
        style={{ fontVariationSettings: '"opsz" 36, "wght" 400' }}
      >
        {trophy.dek}
      </div>

      <div className="grid grid-cols-1 @[1024px]:grid-cols-[1.05fr_1fr] gap-10 @[1024px]:gap-12 items-start">
        <div
          className="font-serif text-[17px] sm:text-[18px] leading-[1.65] text-ink"
          style={{ fontVariationSettings: '"opsz" 18, "wght" 400' }}
        >
          {trophy.paragraphs.map((p, i) => (
            <p key={i} className="mb-4 last:mb-0 [text-wrap:pretty]">
              {p}
            </p>
          ))}
        </div>
        <div className="rounded border border-paper-edge bg-paper/70 px-4 py-4 sm:px-[18px]">
          <div className="font-mono text-[10.5px] tracking-stat uppercase text-sage mb-2">
            Route · elevation profile
          </div>
          {ROUTE_FOR[trophy.slug]}
        </div>
      </div>

      <StatPanel items={trophy.stats} />

      <div className="font-mono text-[10.5px] tracking-stat uppercase text-sage mb-2">
        Photographs
      </div>
      <PhotoStrip
        photos={photos}
        layout="strip"
        emptyHint={`Photos from ${trophy.title.replace(/[.,]$/, '')} coming soon.`}
      />
    </article>
  );
}
