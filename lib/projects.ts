import fs from 'node:fs';
import path from 'node:path';
import { matter } from './matter';
import { z } from 'zod';

/**
 * Project deep-dives. Source files live at `content/projects/*.mdx` —
 * frontmatter for the header chrome (kicker / title / dek / meta / tags
 * / corner badges), body for the long-form prose + figures + marginalia.
 *
 * Slug is the filename minus extension; the dynamic route at
 * app/projects/[slug]/page.tsx renders one MDX per slug.
 *
 * Add / edit via /admin/ → Projects, or by editing the MDX files
 * directly. Frontmatter is validated by zod — bad frontmatter fails
 * the build loudly.
 */

const BadgeRev = z.object({
  type: z.literal('rev'),
  rev: z.string().min(1),
  text: z.string().default('REV'),
});

const BadgeLed = z.object({
  type: z.literal('led'),
  label: z.string().min(1),
  /** Optional shorter label used in the inline-mobile fallback. */
  mobileLabel: z.string().optional(),
});

const ProjectBadge = z.discriminatedUnion('type', [BadgeRev, BadgeLed]);

const TagCat = z.enum(['sage', 'rust', 'slate', 'honey', 'clay']);

const ProjectFrontmatter = z.object({
  title: z.string().min(1),
  dek: z.string().min(1),
  /** Eyebrow line, e.g. "Project · Shipped · April 2026". */
  kicker: z.string().min(1),
  /** Meta line under the dek, e.g. "Solo build · running 24/7 on doorpihost". */
  meta: z.string().optional(),
  tags: z.array(z.string()).default([]),
  /** Tag-pill + eyebrow accent. */
  cat: TagCat.default('rust'),
  /** <meta name="description">. */
  description: z.string().min(1),
  /** Optional corner badges (REV stamp / LED). */
  badges: z.array(ProjectBadge).optional(),
  /** Optional sort key for a future /projects/ index. Lower = earlier. */
  order: z.number().int().optional(),
  /** Hide from /projects/ index + generateStaticParams. */
  draft: z.boolean().optional(),
});

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatter>;
export type ProjectBadge = z.infer<typeof ProjectBadge>;

export interface Project {
  slug: string;
  frontmatter: ProjectFrontmatter;
  body: string;
}

const DIR = path.join(process.cwd(), 'content', 'projects');

function readProject(file: string): Project {
  const slug = file.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(DIR, file), 'utf-8');
  const { data, content } = matter(raw);
  return {
    slug,
    frontmatter: ProjectFrontmatter.parse(data),
    body: content.trim(),
  };
}

export function getAllProjects(): Project[] {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(readProject)
    .filter((p) => !p.frontmatter.draft);
}

export function getProject(slug: string): Project | null {
  for (const ext of ['.mdx', '.md']) {
    const filePath = path.join(DIR, `${slug}${ext}`);
    if (fs.existsSync(filePath)) {
      return readProject(`${slug}${ext}`);
    }
  }
  return null;
}
