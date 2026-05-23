/**
 * Single source of truth for the 5-category palette. Owns:
 *   • the `TagCategory` literal type
 *   • hex values for inline SVG (`CAT_HEX`)
 *   • the Tailwind-class triplet per category (stripe / text / bg) plus
 *     a couple of role-specific keys (`border`, `borderL`).
 *
 * Tag pills, Tile, FilterChips, and the ornament SVGs all consume from
 * here. Adding a new accent? Edit this file + tailwind.config.ts and
 * every consumer follows automatically. Don't fan out new lookup tables.
 *
 * Honey is darkened from the source `#D4923C` to `#B07A2A` for WCAG AA
 * contrast on small text. Deliberate divergence — see DESIGN.md.
 */

export type TagCategory = 'sage' | 'rust' | 'slate' | 'honey' | 'clay';

export const CAT_HEX: Record<TagCategory, string> = {
  sage:  '#6B8059',
  rust:  '#A14D2A',
  slate: '#44546B',
  honey: '#B07A2A',
  clay:  '#8A6F3C',
};

export interface CatClasses {
  /** `text-rust` — accent foreground. */
  text:    string;
  /** `border-rust` — accent border at full strength. */
  border:  string;
  /** `border-l-rust` — for the 4px Tile stripe (use with `border-l-[4px]`). */
  borderL: string;
  /** `bg-rust/[0.06]` — alpha-syntax soft fill (tag pill ground). 7% for honey/clay. */
  bg:      string;
  /** Plain hex literal — for inline SVG stroke/fill. */
  hex:     string;
}

// Static map so Tailwind's content scanner sees every class as a literal
// in source. Computed strings ("bg-" + cat) would get tree-shaken.
const CLASSES: Record<TagCategory, CatClasses> = {
  sage:  { text: 'text-sage',  border: 'border-sage',  borderL: 'border-l-sage',  bg: 'bg-sage/[0.06]',  hex: CAT_HEX.sage  },
  rust:  { text: 'text-rust',  border: 'border-rust',  borderL: 'border-l-rust',  bg: 'bg-rust/[0.06]',  hex: CAT_HEX.rust  },
  slate: { text: 'text-slate', border: 'border-slate', borderL: 'border-l-slate', bg: 'bg-slate/[0.06]', hex: CAT_HEX.slate },
  honey: { text: 'text-honey', border: 'border-honey', borderL: 'border-l-honey', bg: 'bg-honey/[0.07]', hex: CAT_HEX.honey },
  clay:  { text: 'text-clay',  border: 'border-clay',  borderL: 'border-l-clay',  bg: 'bg-clay/[0.07]',  hex: CAT_HEX.clay  },
};

export function catClasses(cat: TagCategory): CatClasses {
  return CLASSES[cat];
}
