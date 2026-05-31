import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { z } from 'zod';

/**
 * Trophy activities — the endurance entries Wally has picked himself
 * for the /sweat/ page. Source files live at `content/trophies/*.mdx`:
 * frontmatter for the header chrome (kicker / title / dek / coords / stats),
 * body for the prose paragraphs.
 *
 * Slug is the filename minus extension. The /sweat/ page maps slug →
 * gallery id and route ornament, so adding a new trophy means
 * (a) creating content/trophies/{slug}.mdx, (b) wiring `{slug}` into
 * the GALLERY_FOR + ROUTE_FOR maps in app/sweat/page.tsx, and
 * (c) creating content/galleries/sweat_{slug}.yml.
 *
 * Per AUDIT-2026-05-21.md, only WALLY.md-backed facts and prose in
 * Wally's own voice belong here.
 */

export type TrophySlug = string;

const TrophyStat = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  sub: z.string().optional(),
});

export type TrophyStat = z.infer<typeof TrophyStat>;

const TrophyFrontmatter = z.object({
  /** Lower = earlier in /sweat/. */
  order: z.number().int(),
  /** Mono kicker over the title, e.g. "TROPHY · JULY 12–13, 2025". */
  kicker: z.string().min(1),
  /** Display title — leans editorial, not athletic. */
  title: z.string().min(1),
  /** One italic line under the title; the deck. */
  dek: z.string().min(1),
  /** Mono lat/long stamp in the corner. */
  coords: z.string().min(1),
  /** 4-up stat panel beneath the prose. */
  stats: z.array(TrophyStat).min(1),
  /** Mono caption above the right-column panel. Defaults to
   * "Route · elevation profile" — override when the panel art isn't an
   * elevation profile (e.g. football career arc). */
  panelLabel: z.string().optional(),
});

export type TrophyFrontmatter = z.infer<typeof TrophyFrontmatter>;

export interface Trophy extends TrophyFrontmatter {
  slug: TrophySlug;
  /** Body paragraphs — body MDX split on blank lines. Voice: warm, specific. */
  paragraphs: string[];
}

const DIR = path.join(process.cwd(), 'content', 'trophies');

function readTrophy(file: string): Trophy {
  const slug = file.replace(/\.mdx?$/, '');
  const raw = fs.readFileSync(path.join(DIR, file), 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = TrophyFrontmatter.parse(data);
  const paragraphs = content
    .trim()
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  return { slug, ...frontmatter, paragraphs };
}

export const TROPHIES: Trophy[] = (() => {
  if (!fs.existsSync(DIR)) return [];
  return fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.md') || f.endsWith('.mdx'))
    .map(readTrophy)
    .sort((a, b) => a.order - b.order);
})();

export function getTrophy(slug: TrophySlug): Trophy | undefined {
  return TROPHIES.find((t) => t.slug === slug);
}
