import type { TagCategory } from '@/components/ornaments/catClass';

/**
 * Essay metadata. Bodies live at `app/writing/[slug]/page.mdx` (or
 * eventually `content/essays/<slug>.mdx`) once that wiring exists.
 * For v1 the list is empty by design — see PORT-PLAN Pass 7 + WALLY.md
 * open question #5. The first essay is the gating piece.
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
}

export const ESSAYS: ReadonlyArray<EssayMeta> = [];

/** Sorted by date, newest first. */
export const ESSAYS_SORTED: ReadonlyArray<EssayMeta> = [...ESSAYS].sort((a, b) =>
  a.date < b.date ? 1 : -1,
);
