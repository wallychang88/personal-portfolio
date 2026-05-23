import Link from 'next/link';
import { catClasses, type TagCategory } from './ornaments/catClass';

/**
 * Bento tile — the universal card primitive across the homepage grid.
 * Wraps content in an `<a>` so the whole tile is one focusable target;
 * non-linked tiles render as a `<div>` (currently only the NOW filler).
 *
 * Hover state: lift -4px + rotate 0.3deg, shadow grows, the category
 * stripe brightens, and a corner arrow fades in. All purely CSS; no
 * client component needed.
 *
 * Category stripe is `border-l-[4px] border-<cat>` — clean DOM, no ::before
 * pseudo (per Pass 4 discipline rules in PORT-PLAN). Palette via
 * `catClasses()` so this file doesn't duplicate the lookup table.
 *
 * Span uses Tailwind's grid-column/row arbitrary spans so the parent
 * Bento layout can stay declarative. Default is 1×1.
 */

export interface TileProps {
  /** Category accent for the stripe + arrow. */
  cat: TagCategory;
  /** Internal href (Link) or external URL. Tile becomes a non-link div if omitted. */
  href?: string;
  /** Open in new tab — set automatically for absolute http(s) URLs. */
  external?: boolean;
  /** Accessible label for the whole-tile link. Required when `href` is set. */
  ariaLabel?: string;
  /** Bento grid column span at @[768px]+ (default 1). */
  cols?: 1 | 2 | 3 | 4 | 6;
  /** Bento grid row span at @[768px]+ (default 1). */
  rows?: 1 | 2 | 3;
  children: React.ReactNode;
  className?: string;
}

// Tiles stack into a single column under the @[768px] container-query
// breakpoint, then claim their bento span once the band grid switches
// to 6-column mode. Classes are static literals so Tailwind's content
// scanner picks them up.
const COL_SPAN: Record<NonNullable<TileProps['cols']>, string> = {
  1: 'col-span-1 @[768px]:col-span-1',
  2: 'col-span-1 @[768px]:col-span-2',
  3: 'col-span-1 @[768px]:col-span-3',
  4: 'col-span-1 @[768px]:col-span-4',
  6: 'col-span-1 @[768px]:col-span-6',
};
const ROW_SPAN: Record<NonNullable<TileProps['rows']>, string> = {
  1: 'row-span-1',
  2: 'row-span-1 @[768px]:row-span-2',
  3: 'row-span-1 @[768px]:row-span-3',
};

export function Tile({
  cat,
  href,
  external,
  ariaLabel,
  cols = 1,
  rows = 1,
  children,
  className = '',
}: TileProps) {
  const c = catClasses(cat);
  const baseClasses = [
    'group/tile relative overflow-hidden flex flex-col',
    'bg-tile rounded-tile p-[22px]',
    'border border-ink/10',
    `border-l-[4px] ${c.borderL}`,
    'shadow-hairline',
    'transition-[transform,box-shadow,border-color] duration-200',
    'motion-safe:hover:shadow-tile-hover',
    'motion-safe:hover:-translate-y-1 motion-safe:hover:rotate-[0.3deg]',
    'hover:z-[2]',
    COL_SPAN[cols],
    ROW_SPAN[rows],
    className,
  ].join(' ');

  const inner = (
    <>
      {children}
      {href && (
        <span
          aria-hidden="true"
          className={
            'pointer-events-none absolute bottom-4 right-[18px] ' +
            'text-sm opacity-0 transition-[opacity,transform] duration-200 ' +
            'group-hover/tile:opacity-100 group-hover/tile:translate-x-0.5 ' +
            c.text
          }
        >
          →
        </span>
      )}
    </>
  );

  if (!href) {
    return <div className={baseClasses}>{inner}</div>;
  }

  const isExternal = external ?? /^https?:\/\//i.test(href);
  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={ariaLabel}
        className={baseClasses}
      >
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} aria-label={ariaLabel} className={baseClasses}>
      {inner}
    </Link>
  );
}
