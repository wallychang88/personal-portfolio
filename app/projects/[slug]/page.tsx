import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { TagRow } from '@/components/tag';
import {
  Figure,
  ProjectColumns,
  ProjectMarginalia,
  MarginaliaCard,
  EndNote,
} from '@/components/project-shell';
import { Prose, Callout, Section, SectionOrnament } from '@/components/section';
import {
  OrnSchematic,
  OrnRevStamp,
  OrnLED,
  OrnPullQuote,
} from '@/components/ornaments';
import { StatPanel } from '@/components/stat-panel';
import {
  getAllProjects,
  getProject,
  type ProjectBadge,
  type ProjectFrontmatter,
} from '@/lib/projects';

/**
 * Project deep-dive dynamic route. One MDX file per slug under
 * content/projects/. Frontmatter drives the page chrome (kicker,
 * title, dek, meta, tags, corner badges); body MDX renders inside.
 * The static export gets one HTML file per slug at build time.
 */

interface PageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: PageProps): Metadata {
  const project = getProject(params.slug);
  if (!project) return {};
  return {
    title: `${project.frontmatter.title.split(' — ')[0]} — Wally Chang`,
    description: project.frontmatter.description,
  };
}

const components = {
  Figure,
  ProjectColumns,
  ProjectMarginalia,
  MarginaliaCard,
  EndNote,
  Prose,
  Callout,
  Section,
  SectionOrnament,
  OrnSchematic,
  OrnRevStamp,
  OrnLED,
  OrnPullQuote,
  StatPanel,
};

const EYEBROW_TEXT: Record<ProjectFrontmatter['cat'], string> = {
  sage: 'text-sage',
  rust: 'text-rust',
  slate: 'text-slate',
  honey: 'text-honey',
  clay: 'text-clay',
};

function Badge({ badge, mobile = false }: { badge: ProjectBadge; mobile?: boolean }) {
  if (badge.type === 'rev') {
    return <OrnRevStamp rev={badge.rev}>{badge.text}</OrnRevStamp>;
  }
  return <OrnLED label={mobile && badge.mobileLabel ? badge.mobileLabel : badge.label} />;
}

export default function ProjectPage({ params }: PageProps) {
  const project = getProject(params.slug);
  if (!project) notFound();

  const { frontmatter, body } = project;
  const eyebrowClass = EYEBROW_TEXT[frontmatter.cat];

  return (
    <div className="max-w-page mx-auto px-6 sm:px-10 pb-20">
      <div className="pt-10 pb-2">
        <Link
          href="/"
          className="font-mono text-xs tracking-meta text-ink-soft hover:text-ink transition-colors"
        >
          ← Index
        </Link>
      </div>

      <header className="relative pt-12 pb-10">
        {frontmatter.badges && frontmatter.badges.length > 0 ? (
          <div className="absolute top-12 right-0 hidden @[768px]:flex flex-col items-end gap-2.5">
            {frontmatter.badges.map((b, i) => (
              <Badge key={i} badge={b} />
            ))}
          </div>
        ) : null}

        <div
          className={`text-[11px] font-sans font-semibold tracking-eyebrow uppercase ${eyebrowClass} mb-4`}
        >
          {frontmatter.kicker}
        </div>
        <h1
          className="font-serif text-[40px] sm:text-[52px] @[1100px]:text-[64px] leading-[1.03] tracking-[-0.02em] text-ink mb-4 [text-wrap:balance] max-w-[980px]"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
        >
          {frontmatter.title}
        </h1>
        <p
          className="font-serif italic text-[18px] sm:text-[22px] leading-[1.4] text-ink-soft mb-6 [text-wrap:balance] max-w-[820px]"
          style={{ fontVariationSettings: '"opsz" 36, "wght" 400' }}
        >
          {frontmatter.dek}
        </p>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          {frontmatter.meta ? (
            <div className="font-mono text-[11.5px] tracking-meta text-ink-soft">
              {frontmatter.meta}
            </div>
          ) : null}
          {frontmatter.tags.length > 0 ? (
            <TagRow tags={frontmatter.tags} cat={frontmatter.cat} />
          ) : null}
        </div>

        {frontmatter.badges && frontmatter.badges.length > 0 ? (
          <div className="mt-6 flex items-center gap-3.5 @[768px]:hidden">
            {frontmatter.badges.map((b, i) => (
              <Badge key={i} badge={b} mobile />
            ))}
          </div>
        ) : null}
      </header>

      <MDXRemote source={body} components={components} />
    </div>
  );
}
