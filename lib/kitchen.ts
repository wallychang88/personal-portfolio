import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * /kitchen/ page chrome. Single MDX file at `content/kitchen.mdx`;
 * frontmatter holds the hero copy and per-section labels. The composition
 * (which sections render, photo strips, batch list integration) stays in
 * `app/kitchen/page.tsx`. Edited via /admin/ → Pages → Kitchen.
 */

const KitchenFrontmatter = z.object({
  metaTitle: z.string().min(1),
  metaDescription: z.string().min(1),
  eyebrow: z.string().min(1),
  heading: z.string().min(1),
  dek: z.string().min(1),

  bagelsEyebrow: z.string().min(1),
  bagelsHeading: z.string().min(1),
  /** Italic placeholder paragraph shown when no batches have shipped yet. */
  bagelsEmpty: z.string().min(1),
  /** Thumb-stamp label shown when there are no batches. */
  bagelsEmptyStamp: z.string().min(1),
  bagelsPhotosHint: z.string().min(1),

  practiceEyebrow: z.string().min(1),
  practiceHeading: z.string().min(1),
  practiceDek: z.string().min(1),

  breadLabel: z.string().min(1),
  breadPhotosHint: z.string().min(1),
  pizzaLabel: z.string().min(1),
  pizzaPhotosHint: z.string().min(1),
});

export type KitchenFrontmatter = z.infer<typeof KitchenFrontmatter>;

const FILE = path.join(process.cwd(), 'content', 'kitchen.mdx');

export function getKitchen(): KitchenFrontmatter {
  const raw = fs.readFileSync(FILE, 'utf-8');
  const { data } = matter(raw);
  return KitchenFrontmatter.parse(data);
}
