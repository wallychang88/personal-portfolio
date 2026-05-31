import fs from 'node:fs';
import path from 'node:path';
import { matter } from './matter';
import { z } from 'zod';
import type { TagCategory } from '@/components/ornaments/catClass';

/**
 * Essays. Source files live at `content/essays/*.md` — one file per
 * essay. Frontmatter shape is enforced by EssayFrontmatter (zod) so a
 * malformed entry fails the build loudly instead of shipping broken.
 *
 * v1 ships with an empty directory by design — see PORT-PLAN Pass 7 +
 * WALLY.md open question #5. The first essay is the gating piece.
 *
 * To add an essay: drop `content/essays/<slug>.md` with frontmatter +
 * body, or use the Decap admin at `/admin/` once production OAuth is
 * wired (today: `pnpm dev` + the local_backend mode).
 */

export interface EssayMeta {
  slug: string;
  /** ISO 'YYYY-MM-DD' — sort newest first. */
  date: string;
  title: string;
  /** One-line summary. */
  hook: string;
  /** Italic pull-quote shown in the index row. */
  excerpt: string;
  cat: TagCategory;
  /** Human-readable category, e.g. 'endurance' or 'software'. */
  catLabel: string;
  wordCount: number;
  /** Pre-rendered reading time string, e.g. "9 MIN". */
  readingTime: string;
  /** Raw markdown body. Empty if the file is frontmatter-only. */
  body: string;
}

const TAG_CATEGORY = z.enum(['sage', 'rust', 'slate', 'honey', 'clay']);

// YAML parses an unquoted `date: 2026-05-25` as a JS Date object, while a
// quoted `date: "2026-05-25"` stays a string. Decap writes the quoted form,
// but hand-edited files often use the unquoted form. Preprocess so either
// shape lands on the canonical ISO-string contract.
const isoDateString = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD'),
);

// `slug` is derived from the filename below — not from frontmatter — so it
// stays a consequence of where the file lives, not a thing you have to
// keep in sync. Old files with `slug:` in frontmatter still parse fine
// because zod ignores unknown keys by default.
const EssayFrontmatter = z.object({
  date: isoDateString,
  title: z.string().min(1),
  hook: z.string().min(1),
  excerpt: z.string().min(1),
  cat: TAG_CATEGORY,
  catLabel: z.string().min(1),
});

const CONTENT_DIR = path.join(process.cwd(), 'content', 'essays');

function loadEssays(): EssayMeta[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs
    .readdirSync(CONTENT_DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const fm = EssayFrontmatter.parse(data);
    const slug = file.replace(/\.mdx?$/, '');
    const body = content.trim();
    const wordCount = body ? body.split(/\s+/).length : 0;
    const readingMinutes = Math.max(1, Math.round(wordCount / 220));
    return {
      ...fm,
      slug,
      wordCount,
      readingTime: `${readingMinutes} MIN`,
      body,
    };
  });
}

export const ESSAYS: ReadonlyArray<EssayMeta> = loadEssays();

/** Sorted by date, newest first. */
export const ESSAYS_SORTED: ReadonlyArray<EssayMeta> = [...ESSAYS].sort((a, b) =>
  a.date < b.date ? 1 : -1,
);
