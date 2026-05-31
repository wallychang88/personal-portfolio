import fs from 'node:fs';
import path from 'node:path';
import { matter } from './matter';
import { z } from 'zod';

/**
 * The timeline. Source files live at `content/timeline/*.md` — one
 * file per entry, frontmatter for metadata, markdown body for the
 * hook prose. Filename convention is `{sortDate}-{slug}.md` so a
 * plain alphabetical directory listing matches chronological order.
 *
 * Each entry's `kind` field must be one of:
 *   - "project"   — something I built; usually links to a deep-dive page
 *   - "writing"   — an essay or opinion piece (lives under /writing)
 *   - "role"      — a job or major engagement
 *   - "coursework"— academic projects and final papers
 *   - "milestone" — degrees, talks, anything notable but not a project
 *
 * Add/edit/remove entries via /admin/ → Timeline, or by editing the
 * markdown files directly. The loader validates frontmatter at build
 * time via zod — malformed entries fail the build loudly.
 */

export type TimelineKind =
  | 'project'
  | 'writing'
  | 'role'
  | 'coursework'
  | 'milestone';

const TIMELINE_KIND = z.enum([
  'project',
  'writing',
  'role',
  'coursework',
  'milestone',
]);

const isoDateString = z.preprocess(
  (v) => (v instanceof Date ? v.toISOString().slice(0, 10) : v),
  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'sortDate must be YYYY-MM-DD'),
);

const TimelineFrontmatter = z.object({
  /** ISO date used for sorting. */
  sortDate: isoDateString,
  /** What the reader sees in the date column, e.g. "Apr 2026" or "Spring 2024". */
  date: z.string().min(1),
  kind: TIMELINE_KIND,
  /** Small label under the date, e.g. "Project · ongoing". Optional. */
  kindLabel: z.string().optional(),
  title: z.string().min(1),
  tags: z.array(z.string()).default([]),
  /** Internal route or external URL. Omit for headline-only entries. */
  href: z.string().optional(),
  /** If true, link opens in a new tab. */
  external: z.boolean().optional(),
});

export interface TimelineEntry {
  sortDate: string;
  date: string;
  kind: TimelineKind;
  kindLabel?: string;
  title: string;
  /** Hook prose — pulled from the markdown body, not frontmatter. */
  hook: string;
  tags: string[];
  href?: string;
  external?: boolean;
}

const DIR = path.join(process.cwd(), 'content', 'timeline');

function loadTimeline(): TimelineEntry[] {
  if (!fs.existsSync(DIR)) return [];
  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));

  return files.map((file) => {
    const raw = fs.readFileSync(path.join(DIR, file), 'utf-8');
    const { data, content } = matter(raw);
    const fm = TimelineFrontmatter.parse(data);
    return {
      ...fm,
      hook: content.trim(),
    };
  });
}

export const TIMELINE: ReadonlyArray<TimelineEntry> = loadTimeline();

/** Sorted newest-first. The homepage and any other consumer should use this. */
export const TIMELINE_SORTED: ReadonlyArray<TimelineEntry> = [...TIMELINE].sort(
  (a, b) => b.sortDate.localeCompare(a.sortDate),
);
