import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * Bake batch notes. Source files live at `content/batches/*.md` — one
 * file per batch. Frontmatter is validated by zod so the build fails
 * loudly on a malformed entry.
 *
 * v1 ships with an empty directory — Wally hasn't published specifics
 * (hydration / ferment / oven setup) yet (see WALLY.md "Kitchen — the
 * patience register" open question). The first batch entry unlocks the
 * featured-curve hero and recent-batches grid in app/kitchen/page.tsx.
 */

export interface BatchNote {
  slug: string;
  /** ISO 'YYYY-MM-DD' — sort newest first. */
  date: string;
  /** Display number, e.g. 41. */
  number: number;
  kind: 'bagel' | 'bread' | 'pizza';
  title: string;
  /** Optional process facts. Omit any field the bake didn't capture. */
  hydration?: string;
  ferment?: string;
  oven?: string;
  /** Free-form notes. One line each. */
  notes: string[];
  /** Raw markdown body (long-form notes). Empty if frontmatter-only. */
  body: string;
}

// Mirror lib/essays.ts: accept both quoted ISO strings (Decap) and
// unquoted YAML dates (hand-edits) on the canonical YYYY-MM-DD shape.
const isoDateString = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
);

// Slug is derived from the filename in loadBatches() — not from
// frontmatter — so there's no manual sync to keep.
const BatchFrontmatter = z.object({
  date: isoDateString,
  number: z.number().int().positive(),
  kind: z.enum(['bagel', 'bread', 'pizza']),
  title: z.string().min(1),
  hydration: z.string().optional(),
  ferment: z.string().optional(),
  oven: z.string().optional(),
  notes: z.array(z.string()).default([]),
});

const CONTENT_DIR = path.join(process.cwd(), 'content', 'batches');

function loadBatches(): BatchNote[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const fm = BatchFrontmatter.parse(data);
    return {
      ...fm,
      slug: file.replace(/\.mdx?$/, ''),
      body: content.trim(),
    };
  });
}

export const BATCHES: ReadonlyArray<BatchNote> = loadBatches();

export const BATCHES_SORTED: ReadonlyArray<BatchNote> = [...BATCHES].sort((a, b) =>
  a.date < b.date ? 1 : -1,
);
