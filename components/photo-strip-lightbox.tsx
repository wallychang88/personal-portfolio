'use client';

import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import type { Photo } from '@/lib/galleries';

/**
 * Lightbox shell — imported lazily by `photo-strip.tsx` via `next/dynamic`.
 * Keeping the library + its CSS in a dedicated module means the chunk
 * (lib JS + library CSS) only loads when the user actually opens a photo.
 *
 * Rendered exclusively while the strip is in the "open" state — so we
 * pass `open={true}` unconditionally and let the parent unmount us to
 * close.
 */
export default function PhotoStripLightbox({
  photos,
  index,
  onClose,
}: {
  photos: readonly Photo[];
  index: number;
  onClose: () => void;
}) {
  return (
    <Lightbox
      open
      index={index}
      close={onClose}
      slides={photos.map((p) => ({
        src: p.src,
        alt: p.alt,
        width: p.width,
        height: p.height,
        description: p.caption,
      }))}
    />
  );
}
