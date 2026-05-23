/**
 * Photo galleries — the single source of truth for which images appear
 * where on the site.
 *
 * Adding a photo:
 *   1. Drop the file into `public/images/{gallery_id}/` (create the
 *      folder if it doesn't exist yet).
 *   2. Add an entry to the array below. Caption is what the reader sees;
 *      alt is for screen readers and search indexers.
 *
 * Or, faster: run `pnpm new-photo` from the project root and answer the
 * prompts. The script will copy the file in and add the entry for you.
 *
 * Galleries with an empty array render an elegant placeholder; the page
 * does not break.
 */

export interface Photo {
  /** Path relative to `/public`, e.g. `/images/endurance/whitney-trout.jpg`. */
  src: string;
  /** Short caption shown under the image (optional). */
  caption?: string;
  /** Alt text. Required for accessibility. */
  alt: string;
  /** Optional natural dimensions for layout hinting. */
  width?: number;
  height?: number;
}

export const GALLERIES = {
  // ────────────────────────────────────────────────────────────────
  //  Endurance
  // ────────────────────────────────────────────────────────────────

  endurance_whitney: [] satisfies Photo[],
  // Suggested: 3-5 photos.
  // Ideas: trout at 12k, alpine camp at dusk, summit at sunrise, the
  // descent, the trailhead sign at the end. Wide landscape orientation
  // looks best in the strip layout.

  endurance_tioga: [] satisfies Photo[],
  // Suggested: 3-5 photos.
  // Ideas: empty road through Tioga Pass, you + Olivia on a switchback,
  // the rim view over Tuolumne Meadows, max-speed descent.

  endurance_ironman: [] satisfies Photo[],
  // Suggested: 2-3 photos.
  // Ideas: pre-race transition, bike leg shot if anyone caught one,
  // finish-line photo. (The official Ironman photographer photos work
  // too — those are usually licensed for personal use.)

  // ────────────────────────────────────────────────────────────────
  //  Kitchen
  // ────────────────────────────────────────────────────────────────

  baking_bagels: [] satisfies Photo[],
  // The trophy bake. Show: dough rings before boil, the boil itself,
  // sesame/everything topping shots, the crumb cross-section, a stack.
  // Bagels are the headline; do them justice.

  baking_pizza: [] satisfies Photo[],
  // Practice rounds. Show: the dough, the leoparding on the crust, a
  // finished pizza top-down on a board.

  baking_bread: [] satisfies Photo[],
  // Sourdough loaves, crumb shots, anything that came out of a Dutch
  // oven and looked like it deserved a portrait.
} as const;

export type GalleryId = keyof typeof GALLERIES;

export function getGallery(id: GalleryId): readonly Photo[] {
  return GALLERIES[id];
}
