/**
 * Tag pill. Pass `cat` when the category is known; otherwise the palette
 * rotates deterministically per-tag so the same string always renders the
 * same color across the site.
 *
 * Background is the accent color at ~6% alpha (Tailwind slash-opacity
 * syntax). Border + text are the accent color at full strength. Mirrors
 * `_unified.jsx` `.uni .tag.<cat>` recipe.
 */

export type TagCategory = 'sage' | 'rust' | 'slate' | 'honey' | 'clay';

const ROTATING: TagCategory[] = ['clay', 'sage', 'slate', 'rust', 'honey'];

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function paletteFor(cat: TagCategory): string {
  switch (cat) {
    case 'sage':  return 'bg-sage/[0.06]  text-sage  border-sage';
    case 'rust':  return 'bg-rust/[0.06]  text-rust  border-rust';
    case 'slate': return 'bg-slate/[0.06] text-slate border-slate';
    case 'honey': return 'bg-honey/[0.07] text-honey border-honey';
    case 'clay':  return 'bg-clay/[0.07]  text-clay  border-clay';
  }
}

export function Tag({ label, cat }: { label: string; cat?: TagCategory }) {
  const category = cat ?? ROTATING[hash(label) % ROTATING.length];
  return (
    <span
      className={`inline-flex items-center text-[11px] font-medium tracking-[0.01em] px-2.5 py-0.5 rounded-full border ${paletteFor(category)}`}
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
