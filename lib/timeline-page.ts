import fs from 'node:fs';
import path from 'node:path';
import { matter } from './matter';
import { z } from 'zod';

/**
 * /timeline/ index page chrome. Single MDX file at `content/timeline-page.mdx`;
 * frontmatter only. Individual entries live in content/timeline/*.md
 * (see `lib/timeline.ts`).
 *
 * Filename uses `timeline-page.mdx` (not `timeline.mdx`) to avoid colliding
 * with the content/timeline/ folder collection.
 */

const TimelinePageFrontmatter = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  dek: z.string().min(1),
});

export type TimelinePageFrontmatter = z.infer<typeof TimelinePageFrontmatter>;

const FILE = path.join(process.cwd(), 'content', 'timeline-page.mdx');

export function getTimelinePage(): TimelinePageFrontmatter {
  const raw = fs.readFileSync(FILE, 'utf-8');
  const { data } = matter(raw);
  return TimelinePageFrontmatter.parse(data);
}
