import type { Metadata } from 'next';
import Link from 'next/link';
import { PhotoStrip } from '@/components/photo-strip';
import { StatPanel } from '@/components/stat-panel';
import { GALLERIES } from '@/lib/galleries';

export const metadata: Metadata = {
  title: 'Endurance — Wally Chang',
  description:
    'Three days that earned themselves a page. Tioga Road, Mount Whitney, and Indian Wells.',
};

export default function EndurancePage() {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-10">
      {/* Crumb back to index */}
      <div className="pt-12 pb-2">
        <Link
          href="/"
          className="text-[11px] tracking-eyebrow uppercase text-ink-faint hover:text-ink transition-colors"
        >
          ← Index
        </Link>
      </div>

      {/* ============================================================
          Hero
          ============================================================ */}
      <section className="pt-10 pb-14 max-w-reading">
        <div className="text-[11px] tracking-eyebrow uppercase text-ink-faint mb-5">
          Endurance · A handful of days that earned a page
        </div>
        <h1 className="font-serif text-[44px] sm:text-[56px] leading-[1.05] tracking-tight text-ink">
          I’ve been an athlete longer than I’ve been anything else.
        </h1>
        <p className="mt-5 font-serif italic text-[20px] leading-[1.45] text-ink-muted">
          Three years on the sprint football roster at Cornell taught me how
          to suffer well; triathlon and the Sierras are how I keep practising.
          Here are the three days that earned their own pages.
        </p>
        <p className="mt-6 text-[15px] leading-[1.65] text-ink-soft">
          More on{' '}
          <a
            href="https://www.strava.com/athletes/58368801"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ink border-b border-ink-faint hover:border-ink transition-colors"
          >
            Strava
          </a>
          , where the training is in public.
        </p>
      </section>

      {/* ============================================================
          1. Mount Whitney — the story
          ============================================================ */}
      <section className="border-t border-paper-edge pt-14 pb-12">
        <div className="max-w-reading">
          <div className="text-[11px] tracking-eyebrow uppercase text-ink-faint mb-3">
            Trophy · July 2025
          </div>
          <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.08] tracking-tight text-ink">
            Mount Whitney, alpine start.
          </h2>
          <p className="mt-2 font-serif italic text-[17px] text-ink-soft">
            July 12 – 13, 2025 · Inyo National Forest · Whitney Zone
          </p>

          <div className="prose-editorial mt-7">
            <p>
              Saturday at 10:47 in the morning we walked into the Whitney
              Zone with packs and rods. Six and a half miles and 3,596 feet
              later we made camp at twelve thousand feet, and spent the
              rest of the afternoon catching trout out of the alpine lake
              next to the tent. Strava’s training algorithm called the
              first day a 193 — &quot;Massive Relative Effort&quot; — which
              is its way of saying the air was thin and we were not
              acclimatised.
            </p>
            <p>
              The summit push left camp at 2:27 the next morning. By
              sunrise we were standing on the 14,505-foot summit of Mount
              Whitney, the highest point in the lower forty-eight, and by
              the time we were back at the trailhead it had been twelve
              hours from leaving the tent. Twenty-one and a half miles
              round trip, sixty-five hundred feet of climbing, one night
              of sleep at altitude in between.
            </p>
            <p>
              The descent pace on Strava tells its own story —{' '}
              <code>33:17</code> per mile on the summit miles, drifting
              down to <code>22:12</code> per mile on the final mile out.
              Gravity helps, but mostly that&apos;s what hunger looks like
              on a stat sheet.
            </p>
          </div>

          <StatPanel
            items={[
              { label: 'Trip distance', value: '21.5 mi' },
              { label: 'Elevation gain', value: '6,509 ft' },
              {
                label: 'Highest point',
                value: '14,505 ft',
                note: 'Mt. Whitney summit',
              },
              {
                label: 'Day 2 start',
                value: '2:27 AM',
                note: 'Alpine start, summit by sunrise',
              },
            ]}
          />
        </div>

        <PhotoStrip
          photos={GALLERIES.endurance_whitney}
          emptyHint="Photos from the climb — coming once Wally uploads."
        />
      </section>

      {/* ============================================================
          2. Tioga Road — the day
          ============================================================ */}
      <section className="border-t border-paper-edge pt-14 pb-12">
        <div className="max-w-reading">
          <div className="text-[11px] tracking-eyebrow uppercase text-ink-faint mb-3">
            Trophy · May 2026
          </div>
          <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.08] tracking-tight text-ink">
            Tioga Road, before the cars.
          </h2>
          <p className="mt-2 font-serif italic text-[17px] text-ink-soft">
            May 14, 2026 · Yosemite National Park
          </p>

          <div className="prose-editorial mt-7">
            <p>
              Every spring, Caltrans plows Tioga Pass open and there is a
              brief window — sometimes a weekend, sometimes a week — when
              the road is clear of snow but still closed to cars. The Sierra
              cyclist community knows about it. I drove out of San Francisco
              in the dark and was rolling at 7:11 in the morning under a
              clear sky and a 51-degree headwind.
            </p>
            <p>
              I rode the whole length of the road with Olivia Duff, who I
              met somewhere in the first hour and who turned out to be much
              faster on the climbs than I was. Eighty-eight miles, seven
              thousand six hundred and eighty feet of climbing, a max speed
              of 42.9 miles an hour somewhere on the descent off the pass.
              A stranger at sunrise and a friend by the time we got back to
              the car.
            </p>
            <p>
              Strava&apos;s &quot;Historic Relative Effort&quot; score for
              the day was a 273. It is, give or take, what I&apos;d trade a
              normal Tuesday for.
            </p>
          </div>

          <StatPanel
            items={[
              { label: 'Distance', value: '88.4 mi' },
              { label: 'Elevation', value: '7,680 ft' },
              { label: 'Moving time', value: '6:19:55' },
              {
                label: 'Top speed',
                value: '42.9 mph',
                note: 'On the descent',
              },
            ]}
          />
        </div>

        <PhotoStrip
          photos={GALLERIES.endurance_tioga}
          emptyHint="The empty road, the rim, the new friend — photos coming."
        />
      </section>

      {/* ============================================================
          3. Ironman 70.3 — the result
          ============================================================ */}
      <section className="border-t border-paper-edge pt-14 pb-16">
        <div className="max-w-reading">
          <div className="text-[11px] tracking-eyebrow uppercase text-ink-faint mb-3">
            Trophy · December 2024
          </div>
          <h2 className="font-serif text-[36px] sm:text-[42px] leading-[1.08] tracking-tight text-ink">
            Indian Wells, 5:41:08.
          </h2>
          <p className="mt-2 font-serif italic text-[17px] text-ink-soft">
            December 8, 2024 · IRONMAN 70.3 Indian Wells La Quinta · Bib 212
            · M18–24
          </p>

          <div className="prose-editorial mt-7">
            <p>
              A 70.3 is a 1.2-mile open-water swim, a 56-mile bike, and a
              13.1-mile run, in that order, with two transitions in
              between. I finished mine in five hours, forty-one minutes,
              and eight seconds.
            </p>
            <p>
              The bike was the strongest leg by a margin I&apos;m proud of —
              2:44:15, division rank 39 out of two hundred and twelve
              eighteen-to-twenty-four-year-olds. The swim and run did what
              they were supposed to do. The transitions were slow. The
              whole thing was a peak, not an experiment; I&apos;ve been an
              athlete since high school, and the day was what it looks like
              when you point that at a calendar for nine months.
            </p>
          </div>

          <StatPanel
            items={[
              {
                label: 'Finish',
                value: '5:41:08',
                note: 'Div rank 46 · Overall 714',
              },
              { label: 'Swim · 1.2 mi', value: '0:43:42' },
              {
                label: 'Bike · 56 mi',
                value: '2:44:15',
                note: 'Div rank 39 — strongest leg',
              },
              { label: 'Run · 13.1 mi', value: '2:00:13' },
            ]}
          />
        </div>

        <PhotoStrip
          photos={GALLERIES.endurance_ironman}
          emptyHint="Race-day photos — coming once Wally uploads."
        />
      </section>
    </div>
  );
}
