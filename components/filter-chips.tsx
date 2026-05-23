'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import type { TagCategory } from './tag';
import { CAT_HEX } from './ornaments/catClass';

export interface ChipOption {
  /** URL value, e.g. 'endurance'. The "All" chip uses `null`. */
  value: string | null;
  label: string;
  /** Category dot color; omit for the "All" chip. */
  cat?: TagCategory;
}

/**
 * Pill row of filter chips backed by the `?cat=` URL query param. Active
 * chip inverts (ink fill / paper text), inactive sits hollow with the
 * category color dot on the left.
 *
 * Buttons (not links) — they manipulate the search params via
 * `router.replace` so the URL stays in sync without a navigation event.
 *
 * Client component: requires window state + useSearchParams.
 */
export function FilterChips({
  options,
  paramKey = 'cat',
  ariaLabel = 'Filter',
}: {
  options: ChipOption[];
  paramKey?: string;
  ariaLabel?: string;
}) {
  const router = useRouter();
  const params = useSearchParams();
  const current = params.get(paramKey);

  const setActive = useCallback(
    (next: string | null) => {
      const sp = new URLSearchParams(params.toString());
      if (next === null) {
        sp.delete(paramKey);
      } else {
        sp.set(paramKey, next);
      }
      const qs = sp.toString();
      router.replace(qs ? `?${qs}` : '?', { scroll: false });
    },
    [params, paramKey, router],
  );

  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = (opt.value ?? null) === (current ?? null);
        return (
          <button
            key={opt.value ?? '__all__'}
            type="button"
            aria-pressed={active}
            onClick={() => setActive(opt.value)}
            className={
              'inline-flex items-center px-3 py-1 rounded-full ' +
              'font-sans text-xs font-medium select-none ' +
              'border transition-[background,color,border-color] duration-200 ' +
              (active
                ? 'bg-ink text-paper border-ink'
                : 'bg-transparent text-ink-soft border-ink/[0.18] hover:text-ink hover:border-ink')
            }
          >
            {opt.cat && (
              <span
                aria-hidden="true"
                className="mr-1.5 inline-block h-2 w-2 rounded-full"
                style={{ background: active ? 'currentColor' : CAT_HEX[opt.cat] }}
              />
            )}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
