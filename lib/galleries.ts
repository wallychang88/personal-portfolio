import fs from 'node:fs';
import path from 'node:path';
import yaml from 'js-yaml';
import { z } from 'zod';

/**
 * Photo galleries — source files live at `content/galleries/{id}.yml`,
 * one file per gallery. The filename (sans extension) is the gallery
 * ID consumers reference (e.g. `sweat_whitney`, `baking_bagels`).
 *
 * Add a photo from /admin/ (Decap "Galleries" collection) or by hand:
 *   1. Drop the file into `public/images/{gallery_id}/` (create the
 *      folder if it doesn't exist yet).
 *   2. Add an entry to the `photos:` array in the gallery's YAML file.
 *      `alt` is required (accessibility); `caption` is optional.
 *
 * Galleries with an empty `photos:` array render an elegant placeholder
 * — the page does not break.
 */

const PhotoSchema = z.object({
  /** Path relative to `/public`, e.g. `/images/sweat_whitney/whitney-trout.jpg`. */
  src: z.string().min(1),
  /** Alt text. Required for accessibility. */
  alt: z.string().min(1),
  /** Short caption shown under the image. */
  caption: z.string().optional(),
  /** Optional natural dimensions for layout hinting. */
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export type Photo = z.infer<typeof PhotoSchema>;

const GallerySchema = z.object({
  label: z.string().min(1),
  hint: z.string().optional(),
  photos: z.array(PhotoSchema).default([]),
});

const DIR = path.join(process.cwd(), 'content', 'galleries');

function loadGalleries(): Record<string, readonly Photo[]> {
  if (!fs.existsSync(DIR)) return {};
  const files = fs
    .readdirSync(DIR)
    .filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));

  const out: Record<string, readonly Photo[]> = {};
  for (const file of files) {
    const id = file.replace(/\.ya?ml$/, '');
    const raw = fs.readFileSync(path.join(DIR, file), 'utf-8');
    const data = yaml.load(raw);
    const parsed = GallerySchema.parse(data);
    out[id] = parsed.photos;
  }
  return out;
}

/**
 * All galleries, keyed by ID (filename sans extension). Loaded once at
 * module-init / build time.
 */
export const GALLERIES: Readonly<Record<string, readonly Photo[]>> =
  loadGalleries();

/**
 * Gallery ID type. With YAML files the set is dynamic; this is just
 * `string` rather than a literal union. Decap's "select gallery"
 * widgets and zod parsing protect against typos at edit + build time.
 */
export type GalleryId = string;

export function getGallery(id: string): readonly Photo[] {
  return GALLERIES[id] ?? [];
}
