import type { Metadata } from 'next';
import Link from 'next/link';
import { TagRow } from '@/components/tag';
import { getAllProjects, type Project, type ProjectFrontmatter } from '@/lib/projects';
import { getProjectsPage } from '@/lib/projects-page';

const projectsPage = getProjectsPage();

export const metadata: Metadata = {
  title: projectsPage.metaTitle,
  description: projectsPage.metaDescription,
};

const EYEBROW_TEXT: Record<ProjectFrontmatter['cat'], string> = {
  sage: 'text-sage',
  rust: 'text-rust',
  slate: 'text-slate',
  honey: 'text-honey',
  clay: 'text-clay',
};

/**
 * /projects/ — index of the long-form deep-dives.
 *
 * Lists every project in content/projects/*.mdx as an editorial row,
 * ordered by the frontmatter `order` key (lower = earlier; entries
 * without one fall to the bottom, then sort by title). Each row links
 * to its deep-dive at /projects/[slug]/. Hero copy lives in
 * content/projects-page.mdx.
 */
export default function ProjectsPage() {
  const projects = [...getAllProjects()].sort(byOrderThenTitle);
  const count = projects.length;

  return (
    <div className="max-w-page mx-auto px-6 sm:px-10 pb-20">
      <section className="pt-16 sm:pt-24 pb-10 sm:pb-12 max-w-[920px]">
        <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-clay mb-5 flex items-center">
          <span className="font-serif italic text-clay mr-2 text-[16px] leading-none">¶</span>
          {projectsPage.eyebrow}
        </div>
        <h1
          className="font-serif text-[40px] sm:text-[52px] @[1100px]:text-[60px] leading-[1.04] tracking-[-0.018em] text-ink mb-6 [text-wrap:balance]"
          style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
        >
          {projectsPage.heading}
        </h1>
        <p
          className="font-serif text-[18px] sm:text-[19px] leading-[1.55] text-ink-muted max-w-[700px] [text-wrap:pretty]"
          style={{ fontVariationSettings: '"opsz" 24, "wght" 400' }}
        >
          {projectsPage.dek}
        </p>
        <div className="mt-7 font-mono text-[11px] tracking-meta uppercase text-ink-faint">
          {count} deep-dive{count === 1 ? '' : 's'}
        </div>
      </section>

      <section className="border-t border-paper-edge" aria-label="All projects">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </section>
    </div>
  );
}

function ProjectRow({ project }: { project: Project }) {
  const { slug, frontmatter } = project;
  const eyebrowClass = EYEBROW_TEXT[frontmatter.cat];

  return (
    <Link
      href={`/projects/${slug}/`}
      className="group block border-b border-paper-edge py-7 sm:py-8 transition-colors hover:bg-paper-deep/50"
    >
      <div
        className={`text-[11px] font-sans font-semibold tracking-eyebrow uppercase ${eyebrowClass} mb-3`}
      >
        {frontmatter.kicker}
      </div>
      <h2
        className="font-serif text-[26px] sm:text-[32px] leading-[1.1] tracking-[-0.015em] text-ink mb-3 [text-wrap:balance] max-w-[820px] group-hover:opacity-70 transition-opacity"
        style={{ fontVariationSettings: '"opsz" 48, "wght" 400' }}
      >
        {frontmatter.title}
      </h2>
      <p
        className="font-serif italic text-[17px] sm:text-[18px] leading-[1.45] text-ink-soft mb-5 [text-wrap:pretty] max-w-[720px]"
        style={{ fontVariationSettings: '"opsz" 24, "wght" 400' }}
      >
        {frontmatter.dek}
      </p>
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        {frontmatter.meta ? (
          <div className="font-mono text-[11px] tracking-meta text-ink-soft">
            {frontmatter.meta}
          </div>
        ) : null}
        {frontmatter.tags.length > 0 ? (
          <TagRow tags={frontmatter.tags} cat={frontmatter.cat} />
        ) : null}
      </div>
    </Link>
  );
}

function byOrderThenTitle(a: Project, b: Project): number {
  const ao = a.frontmatter.order ?? Number.POSITIVE_INFINITY;
  const bo = b.frontmatter.order ?? Number.POSITIVE_INFINITY;
  if (ao !== bo) return ao - bo;
  return a.frontmatter.title.localeCompare(b.frontmatter.title);
}
