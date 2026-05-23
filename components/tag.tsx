/**
 * Tag pill. Pass `cat` when the category is known; otherwise the palette
 * rotates deterministically per-tag so the same string always renders the
 * same color across the site.
 *
 * Background is the accent color at alpha 0.06 (or 0.07 for honey + clay);
 * border + text are the accent color at full strength. Class lookup is
 * routed through `components/ornaments/catClass.ts` so the palette has
 * one source.
 */

import { catClasses, type TagCategory } from './ornaments/catClass';

export type { TagCategory };

const ROTATING: TagCategory[] = ['clay', 'sage', 'slate', 'rust', 'honey'];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

export function Tag({ label, cat }: { label: string; cat?: TagCategory }) {
  const category = cat ?? ROTATING[hash(label) % ROTATING.length];
  const c = catClasses(category);
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium tracking-[0.01em] px-2.5 py-0.5 rounded-full border ${c.bg} ${c.text} ${c.border}`}
    >
      {label}
    </span>
  );
}

export function TagRow({ tags, cat }: { tags: string[]; cat?: TagCategory }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tags.map((t) => (
        <Tag key={t} label={t} cat={cat} />
      ))}
    </div>
  );
}
