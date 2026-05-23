'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useCallback } from 'react';
import type { TagCategory } from './tag';
import { CAT_HEX } from './ornaments/catClass';

export interface ChipOption {
  /** URL value, e.g. 'endurance'. The "All" chip uses `null`. */
  value: string | null;
  label: string;
  /** Category dot color; omit for the "All" chip. */
  cat?: TagCategory;
}

interface FilterChipsProps {
  options: ChipOption[];
  paramKey?: string;
  ariaLabel?: string;
}

/**
 * Pill row of filter chips backed by the `?cat=` URL query param. Active
 * chip inverts (ink fill / paper text), inactive sits hollow with the
 * category color dot on the left.
 *
 * Buttons (not links) — they manipulate the search params via
 * `router.replace` so the URL stays in sync without a navigation event.
 *
 * Client component. `useSearchParams()` requires a Suspense boundary
 * under `output: 'export'` (Next 14 will hard-fail the build otherwise),
 * so we wrap our inner reader and expose the boundary-aware version
 * as the default export. Callers can drop <FilterChips> in anywhere.
 */
export function FilterChips(props: FilterChipsProps) {
  // Render the static chip row as the suspense fallback so the row
  // doesn't visually flicker during hydration — chips just start out
  // un-pressed and become pressed once searchParams hydrates.
  return (
    <Suspense fallback={<FilterChipsFallback options={props.options} ariaLabel={props.ariaLabel} />}>
      <FilterChipsInner {...props} />
    </Suspense>
  );
}

function FilterChipsInner({ options, paramKey = 'cat', ariaLabel = 'Filter' }: FilterChipsProps) {
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
    <ChipRow
      options={options}
      ariaLabel={ariaLabel}
      currentValue={current}
      onActivate={setActive}
    />
  );
}

function FilterChipsFallback({ options, ariaLabel }: { options: ChipOption[]; ariaLabel?: string }) {
  return <ChipRow options={options} ariaLabel={ariaLabel} currentValue={null} onActivate={() => {}} />;
}

function ChipRow({
  options,
  ariaLabel = 'Filter',
  currentValue,
  onActivate,
}: {
  options: ChipOption[];
  ariaLabel?: string;
  currentValue: string | null;
  onActivate: (next: string | null) => void;
}) {
  return (
    <div role="group" aria-label={ariaLabel} className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = (opt.value ?? null) === (currentValue ?? null);
        return (
          <button
            key={opt.value ?? '__all__'}
            type="button"
            aria-pressed={active}
            onClick={() => onActivate(opt.value)}
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
