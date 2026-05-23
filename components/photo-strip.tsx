import type { Photo } from '@/lib/galleries';

/**
 * Photo strip — horizontal row of images with optional caption underneath.
 * Used below trophy-activity editorial blocks on /endurance and for the
 * kitchen section on /baking.
 *
 * When the gallery is empty, renders a quiet placeholder with the same
 * footprint so the page layout doesn't shift when photos arrive.
 */

export function PhotoStrip({
  photos,
  layout = 'strip',
  emptyHint,
}: {
  photos: readonly Photo[];
  layout?: 'strip' | 'grid';
  emptyHint?: string;
}) {
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
    <figure className="mt-8 mb-12">
      <div className={`grid ${grid} gap-3`}>
        {photos.map((photo) => (
          <div key={photo.src} className="space-y-2">
            <div className="aspect-[4/3] overflow-hidden rounded-sm bg-paper-deep">
              {/* Plain <img> rather than next/image — we're a static export
                  with images: unoptimized, and the simplicity wins here. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.src}
                alt={photo.alt}
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </div>
            {photo.caption && (
              <figcaption className="font-serif italic text-[13px] leading-snug text-ink-soft">
                {photo.caption}
              </figcaption>
            )}
          </div>
        ))}
      </div>
    </figure>
  );
}
