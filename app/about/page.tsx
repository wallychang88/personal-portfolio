import type { Metadata } from 'next';
import {
  OrnCompassRose,
  OrnEndurance,
  OrnThumbStamp,
} from '@/components/ornaments';

export const metadata: Metadata = {
  title: 'About — Wally Chang',
  description:
    'Wally Chang — data scientist at Extend, founder of RodSmith, hardware builder, Cornell Sprint Football alum, IRONMAN 70.3 finisher, Sunday baker.',
};

/**
 * /about/ — mixed-register bio.
 *
 * Per AUDIT-2026-05-21.md this page is the most-broken in the round-3
 * design canvas. Every paragraph here is rewritten from WALLY.md
 * ground truth: Extend = extended warranties (not "fraud / payments"),
 * three years of Cornell Sprint Football (not two), RodSmith began
 * fall 2025 (not 2023), github handle wallychang88 (not wallychang),
 * no "grew up in two states" or "around the age of fourteen" origin
 * myth, and no specific bake numbers (36h ferment, 67% hydration)
 * until Wally confirms them.
 *
 * Four sections, each with its category's top-rule color:
 *   1. Bio (no rule — paper)
 *   2. Endurance identity (sage)
 *   3. Kitchen identity (honey)
 */
export default function AboutPage() {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-10 pb-20">
      <PageTitle />
      <BioSection />
      <EnduranceIdentity />
      <KitchenIdentity />
    </div>
  );
}

function PageTitle() {
  return (
    <section className="pt-16 sm:pt-24 pb-14 sm:pb-16 max-w-[980px]">
      <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-ink-faint mb-5">
        About
      </div>
      <h1
        className="font-serif text-[52px] sm:text-[64px] @[1100px]:text-[72px] leading-[1.0] tracking-[-0.02em] text-ink mb-3.5 [text-wrap:balance]"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
      >
        Wally Chang.
      </h1>
      <p
        className="font-serif italic text-[18px] sm:text-[22px] text-ink-soft [text-wrap:balance] max-w-[760px]"
        style={{ fontVariationSettings: '"opsz" 36, "wght" 400' }}
      >
        San Francisco · Cornell &lsquo;23, &lsquo;24 · still chasing summits
        and chew.
      </p>
    </section>
  );
}

function BioSection() {
  return (
    <section className="pb-16">
      <div
        className="font-serif text-[17px] sm:text-[18px] leading-[1.7] text-ink-muted max-w-[680px] [text-wrap:pretty]"
        style={{ fontVariationSettings: '"opsz" 18, "wght" 400' }}
      >
        <p className="mb-5">
          I&rsquo;m a data scientist at Extend, where I work on pricing and
          risk models for extended warranties — deployed across Peloton,
          Oura, Sonos, Michaels, and Advance Auto Parts. Before that, nine
          months as a PE analyst at Carrick Capital covering cyber + GRC;
          before that, label-noise research with the AmEx team at Cornell;
          before that, three years on the Cornell Sprint Football roster as
          #87 (DB → WR), All-CSFL Academic as a senior.
        </p>
        <p className="mb-5">
          On the side I run{' '}
          <a
            href="https://rodsmith.app"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate border-b border-slate/40 hover:border-slate transition-colors"
          >
            RodSmith
          </a>
          , a knowledge-first marketplace for custom fishing rods I started
          in fall 2025, and a slowly-growing rotation of small hardware
          projects — doorpi being the loudest of them. I fish and build my
          own rods, so the founder voice on RodSmith isn&rsquo;t &ldquo;I
          noticed an opportunity&rdquo; so much as &ldquo;I lived the
          broken experience and built the system I wished existed.&rdquo;
        </p>
        <p className="mb-5">
          I bake bagels on Sunday mornings because the dough doesn&rsquo;t
          care whether I had a good week.
        </p>
        <p>
          This site is where all of those put themselves in the same room.
          It is not a résumé. If you are reading it to figure out whether
          to email me, the short answer is yes, and the address is at the
          bottom.
        </p>
      </div>
    </section>
  );
}

function EnduranceIdentity() {
  return (
    <section className="relative pt-9 pb-14 border-t-4 border-sage" id="endurance">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-sage mb-3 flex items-center">
            <span className="mr-2">◆</span>Endurance identity
          </div>
          <h2
            className="font-serif text-[28px] sm:text-[34px] @[1100px]:text-[36px] leading-[1.08] tracking-[-0.014em] text-ink [text-wrap:balance] max-w-[760px]"
            style={{ fontVariationSettings: '"opsz" 60, "wght" 400' }}
          >
            From sprint football to alpine starts.
          </h2>
        </div>
        <OrnCompassRose size={56} accent="rust" />
      </div>

      <div
        className="font-serif text-[17px] sm:text-[18px] leading-[1.7] text-ink-muted max-w-[680px] [text-wrap:pretty]"
        style={{ fontVariationSettings: '"opsz" 18, "wght" 400' }}
      >
        <p className="mb-5">
          I played three years of Cornell Sprint Football — the
          178-lb-cap collegiate league only nine schools play. DB to WR;
          All-CSFL Academic as a senior. The line taught me what hard
          feels like when there are eleven other people in the room
          measuring it with you. That hard is a different shape than the
          alpine-start hard, which is silent and chemical and entirely
          yours.
        </p>
        <p>
          Triathlon is the adult expression. In December 2024 I finished
          IRONMAN 70.3 Indian Wells; in July 2025 I summited Mount
          Whitney; in May 2026 I rode the Tioga Pass before the gate
          opened to cars. The pattern, in case it isn&rsquo;t obvious, is
          that I keep picking events that are mostly about being awake
          for longer than is reasonable. The{' '}
          <a
            href="/endurance/"
            className="text-sage border-b border-sage/40 hover:border-sage transition-colors"
          >
            /endurance/
          </a>{' '}
          page documents the trophy days; this section is just the
          through-line.
        </p>
      </div>

      <div className="mt-8 px-5 py-4 rounded-md border border-sage/30 bg-sage/[0.07]">
        <div className="font-mono text-[10.5px] tracking-stat uppercase text-sage mb-2.5">
          Through-line · 2021 → 2026
        </div>
        <OrnEndurance kind="timeline" width={1080} height={62} delay={2} />
      </div>
    </section>
  );
}

function KitchenIdentity() {
  return (
    <section className="relative pt-9 pb-14 border-t-4 border-honey">
      <div className="flex justify-between items-start mb-6 flex-wrap gap-4">
        <div>
          <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-honey mb-3 flex items-center">
            <span className="mr-2">✤</span>Kitchen identity
          </div>
          <h2
            className="font-serif text-[28px] sm:text-[34px] @[1100px]:text-[36px] leading-[1.08] tracking-[-0.014em] text-ink [text-wrap:balance] max-w-[820px]"
            style={{ fontVariationSettings: '"opsz" 60, "wght" 400' }}
          >
            Bagels are the trophy. Bread and pizza are practice.
          </h2>
        </div>
        <OrnThumbStamp>ONGOING</OrnThumbStamp>
      </div>

      <div
        className="font-serif text-[17px] sm:text-[18px] leading-[1.7] text-ink-muted max-w-[680px] [text-wrap:pretty]"
        style={{ fontVariationSettings: '"opsz" 18, "wght" 400' }}
      >
        <p className="mb-5">
          I bake bagels because the dough doesn&rsquo;t lie. There is no
          founder-bro shortcut in baking, which is, on reflection, why I
          needed baking.
        </p>
        <p>
          The pizza is practice for the bagels, and the bread is practice
          for the pizza. Sourdough loaves are forgiving in a way no other
          format is — you can miss a fold, oven-spring the wrong way, and
          still get bread you can put butter on. The photos and bake
          notes live at{' '}
          <a
            href="/kitchen/"
            className="text-honey border-b border-honey/40 hover:border-honey transition-colors"
          >
            /kitchen/
          </a>
          ; specifics drop in as I write them.
        </p>
      </div>
    </section>
  );
}

