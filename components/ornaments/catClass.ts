import type { TagCategory } from '../tag';

export type { TagCategory };

/**
 * Hex strings for each category accent. Matches `theme.colors.<cat>` in
 * tailwind.config.ts. Inline SVG (stroke/fill) can't reference Tailwind
 * tokens, so the hex literals live here as a single source.
 *
 * Honey is darkened from the source `#D4923C` to `#B07A2A` for WCAG AA
 * contrast on small text. Deliberate divergence — see DESIGN.md.
 */
export const CAT_HEX: Record<TagCategory, string> = {
  sage:  '#6B8059',
  rust:  '#A14D2A',
  slate: '#44546B',
  honey: '#B07A2A',
  clay:  '#8A6F3C',
};

export interface CatClasses {
  /** `border-l-rust` — used as a 4px left stripe on Tile + section rules. */
  stripe: string;
  /** `text-rust` — for the eyebrow / label / ornament hex when rendered via Tailwind. */
  text: string;
  /** `bg-rust/[0.06]` — alpha-syntax background for tag pills + soft fills. */
  bg: string;
  /** Plain hex value, for inline SVG stroke/fill. */
  hex: string;
}

export function catClasses(cat: TagCategory): CatClasses {
  switch (cat) {
    case 'sage':  return { stripe: 'border-l-sage',  text: 'text-sage',  bg: 'bg-sage/[0.06]',  hex: CAT_HEX.sage  };
    case 'rust':  return { stripe: 'border-l-rust',  text: 'text-rust',  bg: 'bg-rust/[0.06]',  hex: CAT_HEX.rust  };
    case 'slate': return { stripe: 'border-l-slate', text: 'text-slate', bg: 'bg-slate/[0.06]', hex: CAT_HEX.slate };
    case 'honey': return { stripe: 'border-l-honey', text: 'text-honey', bg: 'bg-honey/[0.07]', hex: CAT_HEX.honey };
    case 'clay':  return { stripe: 'border-l-clay',  text: 'text-clay',  bg: 'bg-clay/[0.07]',  hex: CAT_HEX.clay  };
  }
}
