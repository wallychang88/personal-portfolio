import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * /sweat/ page chrome — the editorial copy around the trophy list.
 * Single MDX file at `content/sweat.mdx`; only frontmatter is used
 * (the page composition with trophy blocks stays in code). Edited via
 * /admin/ → Pages → Sweat, or by hand.
 *
 * Trophy content itself lives in content/trophies/*.mdx (see
 * `lib/trophies.ts`).
 */

const SweatFrontmatter = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  /** Small mono caption in the masthead, e.g. "Field atlas · vol. III". */
  volumeLabel: z.string().min(1),
  /** Eyebrow above the hero headline. */
  eyebrow: z.string().min(1),
  /** Hero h1. */
  heading: z.string().min(1),
  /** Hero dek — one or two sentences under the headline. */
  dek: z.string().min(1),
});

export type SweatFrontmatter = z.infer<typeof SweatFrontmatter>;

const FILE = path.join(process.cwd(), 'content', 'sweat.mdx');

export function getSweat(): SweatFrontmatter {
  const raw = fs.readFileSync(FILE, 'utf-8');
  const { data } = matter(raw);
  return SweatFrontmatter.parse(data);
}
