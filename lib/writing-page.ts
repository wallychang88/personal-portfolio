import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * /writing/ index page chrome. Single MDX file at `content/writing.mdx`;
 * frontmatter only. The individual essays live in content/essays/*.md
 * (see `lib/essays.ts`).
 */

const WritingFrontmatter = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  dek: z.string().min(1),
  /** Italic paragraph shown when the essay list is empty. */
  emptyBody: z.string().min(1),
  /** Mono caption under the empty-state paragraph. */
  emptyCaption: z.string().min(1),
});

export type WritingFrontmatter = z.infer<typeof WritingFrontmatter>;

const FILE = path.join(process.cwd(), 'content', 'writing.mdx');

export function getWritingPage(): WritingFrontmatter {
  const raw = fs.readFileSync(FILE, 'utf-8');
  const { data } = matter(raw);
  return WritingFrontmatter.parse(data);
}
