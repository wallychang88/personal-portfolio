import fs from 'node:fs';
import path from 'node:path';
import { matter } from './matter';
import { z } from 'zod';

/**
 * /projects/ index page chrome. Single MDX file at
 * `content/projects-page.mdx` — frontmatter only (separate filename from
 * the content/projects/ folder collection so Decap doesn't trip). The
 * individual deep-dives live in content/projects/*.mdx (see
 * `lib/projects.ts`).
 */

const ProjectsPageFrontmatter = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  dek: z.string().min(1),
});

export type ProjectsPageFrontmatter = z.infer<typeof ProjectsPageFrontmatter>;

const FILE = path.join(process.cwd(), 'content', 'projects-page.mdx');

export function getProjectsPage(): ProjectsPageFrontmatter {
  const raw = fs.readFileSync(FILE, 'utf-8');
  const { data } = matter(raw);
  return ProjectsPageFrontmatter.parse(data);
}
