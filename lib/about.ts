import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * /about/ page content. One MDX file at content/about.mdx — frontmatter
 * for the title + tagline, body for the prose and section JSX. Loaded
 * at build time and rendered via next-mdx-remote.
 */

const AboutFrontmatter = z.object({
  title: z.string().min(1),
  tagline: z.string().min(1),
});

export type AboutFrontmatter = z.infer<typeof AboutFrontmatter>;

const FILE = path.join(process.cwd(), 'content', 'about.mdx');

export function getAbout(): { frontmatter: AboutFrontmatter; body: string } {
  const raw = fs.readFileSync(FILE, 'utf-8');
  const { data, content } = matter(raw);
  return {
    frontmatter: AboutFrontmatter.parse(data),
    body: content.trim(),
  };
}
