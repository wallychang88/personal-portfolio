'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import type { Photo } from '@/lib/galleries';

/**
 * Photo strip — horizontal row of images with optional captions. Clicking
 * any image opens a fullscreen lightbox at that index.
 *
 * The lightbox itself + its CSS are lazy-loaded via next/dynamic — they
 * only enter the bundle once the user clicks. Pages using PhotoStrip
 * stay under their first-load budget for the 90%+ of visitors who never
 * open the modal.
 *
 * Empty galleries render a quiet placeholder with the same vertical
 * footprint so layout doesn't shift when photos arrive.
 */

// `next/dynamic` with `ssr: false` is the codex- + Claude-recommended pattern
// for client-only libraries that pull in CSS. The wrapper imports
// `yet-another-react-lightbox/styles.css` inside its own module, so the CSS
// only ships with the lazy chunk too.
const LazyLightbox = dynamic(() => import('./photo-strip-lightbox'), {
  ssr: false,
  loading: () => null,
});

export function PhotoStrip({
  photos,
  layout = 'strip',
  emptyHint,
}: {
  photos: readonly Photo[];
  layout?: 'strip' | 'grid';
  emptyHint?: string;
}) {
  const [openAt, setOpenAt] = useState<number | null>(null);

  if (photos.length === 0) {
    return (
      <div className="mt-8 mb-12 rounded-sm border border-dashed border-paper-edge bg-paper-deep/40 px-6 py-10 text-center">
        <div className="font-serif italic text-[15px] text-ink-soft">
          {emptyHint ?? 'Photos coming soon.'}
        </div>
        <div className="mt-2 text-[11px] tracking-eyebrow uppercase text-ink-faint">
          drop into <code className="not-italic">public/images/</code> · run{' '}
          <code className="not-italic">pnpm new-photo</code>
        </div>
      </div>
    );
  }

  const grid =
    layout === 'grid'
      ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3'
      : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4';

  return (
    <>
      <figure className="mt-8 mb-12">
        <div className={`grid ${grid} gap-3`}>
          {photos.map((photo, i) => (
            <div key={photo.src} className="space-y-2">
              <button
                type="button"
                onClick={() => setOpenAt(i)}
                aria-label={`Open ${photo.alt} in full size`}
                className={
                  'group/photo block aspect-[4/3] w-full overflow-hidden rounded-sm bg-paper-deep ' +
                  'transition-shadow duration-200 motion-safe:hover:shadow-tile-hover'
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  width={photo.width}
                  height={photo.height}
                  className="h-full w-full object-cover transition-transform duration-200 motion-safe:group-hover/photo:scale-[1.02]"
                  loading="lazy"
                />
              </button>
              {photo.caption && (
                <figcaption className="font-serif italic text-[13px] leading-snug text-ink-soft">
                  {photo.caption}
                </figcaption>
              )}
            </div>
          ))}
        </div>
      </figure>

      {openAt !== null && (
        <LazyLightbox
          photos={photos}
          index={openAt}
          onClose={() => setOpenAt(null)}
        />
      )}
    </>
  );
}
