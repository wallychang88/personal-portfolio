import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { Section, SectionOrnament, Prose, Callout } from '@/components/section';
import {
  OrnCompassRose,
  OrnEndurance,
  OrnThumbStamp,
} from '@/components/ornaments';
import { getAbout } from '@/lib/about';

export const metadata: Metadata = {
  title: 'About — Wally Chang',
  description:
    'Wally Chang — data scientist at Extend, founder of RodSmith, hardware builder, Cornell Sprint Football alum, IRONMAN 70.3 finisher, Sunday baker.',
};

/**
 * /about/ — mixed-register bio.
 *
 * Source lives at content/about.mdx; frontmatter holds title + tagline,
 * body is prose + Section JSX. Editable via /admin/ (Decap "About"
 * collection) or by hand. WALLY.md remains the source-of-truth for any
 * biographical fact that ends up in the prose.
 */

const components = {
  Section,
  SectionOrnament,
  Prose,
  Callout,
  OrnCompassRose,
  OrnEndurance,
  OrnThumbStamp,
};

export default async function AboutPage() {
  const { frontmatter, body } = getAbout();

  return (
    <div className="max-w-page mx-auto px-6 sm:px-10 pb-20">
      <section className="pt-16 sm:pt-24 pb-14 sm:pb-16 max-w-[980px]">
        <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-ink-faint mb-5">
          About
        </div>
        <h1
          className="font-serif text-[52px] sm:text-[64px] @[1100px]:text-[72px] leading-[1.0] tracking-[-0.02em] text-ink mb-3.5 [text-wrap:balance]"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
        >
          {frontmatter.title}
        </h1>
        <p
          className="font-serif italic text-[18px] sm:text-[22px] text-ink-soft [text-wrap:balance] max-w-[760px]"
          style={{ fontVariationSettings: '"opsz" 36, "wght" 400' }}
        >
          {frontmatter.tagline}
        </p>
      </section>

      <MDXRemote source={body} components={components} />
    </div>
  );
}
