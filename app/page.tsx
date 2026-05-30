import Link from 'next/link';
import { Tile } from '@/components/tile';
import {
  OrnEndurance,
  OrnLED,
  OrnRevStamp,
  OrnSparkline,
  OrnTenure,
  OrnBakeCurve,
  OrnCrossSection,
  PAHomeSchematic,
} from '@/components/ornaments';
import { Tag } from '@/components/tag';
import { TIMELINE_SORTED } from '@/lib/timeline';

/**
 * Homepage — time-banded Bento.
 *
 * Three bands stacked vertically: THIS MONTH · THIS YEAR · BEFORE NOW.
 * Each band has a mono kicker + date range, hairline rule beneath, and
 * a 6-column dense-flow grid of tiles. On mobile the grid collapses to
 * a single column (container query at @[768px]).
 *
 * Tile content is hand-curated against WALLY.md ground truth — no
 * invented anecdotes, no fabricated counts, no claimed bake times.
 * Tiles 7/8/11 from the design canvas (essay placeholder, batch number,
 * NOW filler with "Tahoe-Mammoth project") are intentionally omitted
 * per AUDIT-2026-05-21.md until Wally writes the real content.
 */
export default function HomePage() {
  return (
    <div className="max-w-canvas mx-auto px-6 sm:px-10 @container">
      <Hero />
      <Band label="THIS MONTH" range="MAY 2026">
        <Tile
          cat="rust"
          href="/projects/doorpi/"
          ariaLabel="doorpi project deep-dive"
          cols={3}
          rows={2}
        >
          <Eyebrow>Project · Shipped · Apr 2026</Eyebrow>
          <TileTitle big>doorpi — a door that knows my face and waits for a peace sign.</TileTitle>
          <TileHook>Pi Zero + ESP32 + MediaPipe. A face-match unlock with a peace-sign verification step before the relay fires.</TileHook>
          <div className="mt-auto pt-3 space-y-3">
            <PAHomeSchematic width={340} height={108} />
            <div className="flex items-center gap-3.5">
              <OrnRevStamp rev="3.2" />
              <OrnLED label="unlock" />
            </div>
          </div>
          <TileTags tags={['Hardware', 'Computer Vision', 'Python']} />
        </Tile>

        <Tile
          cat="sage"
          href="/endurance/#tioga"
          ariaLabel="Tioga Road opening weekend"
          cols={3}
          rows={2}
        >
          <Eyebrow>Endurance · Trophy day · May 2026</Eyebrow>
          <TileTitle big>Tioga Road, before the cars.</TileTitle>
          <TileHook>
            88 miles through Yosemite on opening weekend, after the road was plowed
            but before the gate opened to cars. Crane Flat to Mono Lake, 9,945 ft.
          </TileHook>
          <div className="mt-auto pt-3">
            <OrnEndurance kind="tioga" width={520} height={92} delay={1} summitLabel="9,945 ft" />
          </div>
          <TileTags tags={['Cycling', 'Sierras']} />
        </Tile>
      </Band>

      <Band label="THIS YEAR" range="2025 – 2026">
        <Tile
          cat="slate"
          href="https://rodsmith.app"
          external
          ariaLabel="RodSmith — opens in new tab"
          cols={4}
          rows={1}
        >
          <Eyebrow>Founder · Ongoing · Fall 2025 →</Eyebrow>
          <TileTitle>RodSmith — a knowledge-first marketplace for custom rods.</TileTitle>
          <TileHook>
            Builders meet anglers. Bespoke commissions, made-to-order spec,
            and in-stock inventory in one shape.
          </TileHook>
          <div className="mt-auto pt-3">
            <OrnSparkline width={360} height={56} delay={2} cat="slate" label="DISCOVERY · 8 MO" endLabel="→" />
          </div>
          <TileTags tags={['Marketplace', 'Founding']} />
        </Tile>

        <Tile
          cat="sage"
          href="/endurance/#whitney"
          ariaLabel="Mt. Whitney alpine start"
          cols={2}
          rows={2}
        >
          <Eyebrow>Endurance · Trophy · Jul 2025</Eyebrow>
          <TileTitle>Mount Whitney, alpine start.</TileTitle>
          <TileHook>
            2:27 AM summit push out of Trail Camp. Sunrise at 14,505 ft — the
            highest in the lower 48.
          </TileHook>
          <div className="mt-auto pt-3 flex flex-col items-center gap-2.5">
            <OrnEndurance kind="whitney" width={220} height={120} delay={3} summitLabel="14,505 ft" />
            <div className="font-mono text-[10px] tracking-meta text-ink-soft">36.5786°N · 118.2920°W</div>
          </div>
          <TileTags tags={['Hiking', 'Sierras']} />
        </Tile>

        <Tile
          cat="slate"
          ariaLabel="Data Scientist at Extend"
          cols={2}
          rows={1}
        >
          <Eyebrow>Role · Current · May 2025 →</Eyebrow>
          <TileTitle>Data scientist · Extend.</TileTitle>
          <TileHook>
            Pricing and risk models for extended warranties — Peloton, Oura,
            Sonos, Michaels, Advance Auto Parts.
          </TileHook>
          <div className="mt-auto pt-3">
            <OrnTenure
              width={260}
              height={56}
              delay={2}
              cat="slate"
              label="ROLE TENURE · YR"
              items={[
                { label: 'Carrick', frac: 0.42 },
                { label: 'Extend', frac: 0.58 },
              ]}
            />
          </div>
          <TileTags tags={['Modeling', 'Warranties']} />
        </Tile>

        <Tile cat="honey" href="/kitchen/" ariaLabel="Kitchen — bagels and bake notes" cols={2} rows={1}>
          <Eyebrow>Kitchen · Ongoing</Eyebrow>
          <TileTitle>Sunday bagels.</TileTitle>
          <TileHook>Bagels are the trophy. Bread and pizza are practice.</TileHook>
          <div className="mt-auto pt-3 flex items-center gap-3">
            <OrnCrossSection width={72} height={54} />
            <OrnBakeCurve
              width={170}
              height={54}
              delay={2}
              label="BOIL · BAKE · COOL"
              peakLabel={null}
            />
          </div>
          <TileTags tags={['Bagels']} />
        </Tile>
      </Band>

      <Band label="BEFORE NOW" range="2021 – 2024">
        <Tile
          cat="sage"
          href="/endurance/#ironman"
          ariaLabel="IRONMAN 70.3 Indian Wells"
          cols={2}
          rows={1}
        >
          <Eyebrow>Race · Dec 2024</Eyebrow>
          <TileTitle>IRONMAN 70.3 Indian Wells.</TileTitle>
          <TileHook>5:41:08 finish. Bike was the strongest leg by division rank.</TileHook>
          <div className="mt-auto pt-3">
            <OrnEndurance kind="race" width={260} height={56} delay={3} />
          </div>
          <TileTags tags={['Triathlon']} />
        </Tile>

        <Tile
          cat="sage"
          href="/about/#endurance"
          ariaLabel="Cornell Sprint Football"
          cols={2}
          rows={1}
        >
          <Eyebrow>Legacy · 2021 – 2024</Eyebrow>
          <TileTitle>Cornell Sprint Football #87.</TileTitle>
          <TileHook>
            Three years on the roster. DB → WR. All-CSFL Academic, senior season.
          </TileHook>
          <div className="mt-auto pt-3">
            <OrnEndurance kind="timeline" width={260} height={56} delay={4} />
          </div>
          <TileTags tags={['Football']} />
        </Tile>

        <Tile
          cat="slate"
          ariaLabel="American Express label-noise research"
          cols={2}
          rows={1}
        >
          <Eyebrow>Research · Feb – May 2024</Eyebrow>
          <TileTitle>AmEx label-noise mitigation.</TileTitle>
          <TileHook>
            HDBSCAN + Louvain + LSTM for transformer support-ticket routing.
            Led eight ML engineers.
          </TileHook>
          <div className="mt-auto pt-3">
            <OrnSparkline width={260} height={56} delay={4} cat="slate" label="AUC · 6 MO" endLabel="0.91" />
          </div>
          <TileTags tags={['ML', 'Research']} />
        </Tile>
      </Band>

      <footer className="mt-10 pt-5 border-t border-paper-edge flex items-baseline justify-between gap-6">
        <div className="font-mono text-[10.5px] tracking-meta uppercase text-ink-faint">
          The Bento cherry-picks. The timeline is exhaustive.
        </div>
        <Link
          href="/timeline/"
          className="-mr-2 px-2 py-1 font-serif italic text-[14px] text-ink-soft hover:text-ink transition-colors whitespace-nowrap"
        >
          See all {TIMELINE_SORTED.length} entries →
        </Link>
      </footer>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   Page-local pieces. Not promoted to components/ because they have
   no use outside this layout — the homepage is one composition.
   ───────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="pt-16 sm:pt-24 pb-12 sm:pb-14 max-w-[980px]">
      <div className="text-[11px] tracking-eyebrow uppercase text-ink-faint mb-5">
        A working notebook
      </div>
      <h1
        className="font-serif text-[44px] sm:text-[56px] @[1100px]:text-[62px] leading-[1.05] tracking-[-0.018em] text-ink mb-6 [text-wrap:balance]"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
      >
        Welcome to the portfolio.
      </h1>
      <p
        className="font-serif text-[18px] sm:text-[20px] leading-[1.55] text-ink-muted max-w-[720px] [text-wrap:pretty]"
        style={{ fontVariationSettings: '"opsz" 24, "wght" 400' }}
      >
        The anti-resume. A mix of things that I find significant, not all
        professional. Get to know me!
      </p>
    </section>
  );
}

function Band({
  label,
  range,
  children,
}: {
  label: string;
  range: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first-of-type:mt-0" aria-labelledby={`band-${label.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-baseline justify-between pb-2 border-b border-paper-edge mb-3.5">
        <h2
          id={`band-${label.toLowerCase().replace(/\s+/g, '-')}`}
          className="font-mono text-[10.5px] font-medium tracking-stat uppercase text-ink-faint"
        >
          {label}
        </h2>
        <div className="font-mono text-[10.5px] tracking-stat uppercase text-ink-faint">
          {range}
        </div>
      </div>
      <div
        className="grid grid-cols-1 @[768px]:grid-cols-6 gap-3.5"
        style={{ gridAutoRows: 'minmax(180px, auto)', gridAutoFlow: 'dense' }}
      >
        {children}
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-ink-faint mb-2">
      {children}
    </div>
  );
}

function TileTitle({ children, big = false }: { children: React.ReactNode; big?: boolean }) {
  return (
    <h3
      className={
        'font-serif font-medium text-ink leading-[1.18] tracking-[-0.01em] [text-wrap:balance] mb-2 ' +
        (big ? 'text-[20px] @[1100px]:text-[22px]' : 'text-[17px] @[1100px]:text-[18px]')
      }
      style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
    >
      {children}
    </h3>
  );
}

function TileHook({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[13.5px] leading-[1.55] text-ink-muted [text-wrap:pretty] mb-1">
      {children}
    </p>
  );
}

function TileTags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5 pt-3">
      {tags.map((t) => (
        <Tag key={t} label={t} />
      ))}
    </div>
  );
}
