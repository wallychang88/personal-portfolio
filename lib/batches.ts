/**
 * Bake batch notes. The /kitchen/ page reads from here. v1 ships with an
 * empty array — Wally hasn't published specifics (hydration / ferment /
 * oven setup) yet (see WALLY.md "Kitchen — the patience register" open
 * question). The first batch entry unlocks the featured-curve hero and
 * recent-batches grid in app/kitchen/page.tsx.
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
}

export const BATCHES: ReadonlyArray<BatchNote> = [];

export const BATCHES_SORTED: ReadonlyArray<BatchNote> = [...BATCHES].sort((a, b) =>
  a.date < b.date ? 1 : -1,
);
