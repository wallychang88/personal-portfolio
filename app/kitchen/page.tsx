import type { Metadata } from 'next';
import { MDXRemote } from 'next-mdx-remote/rsc';
import { PhotoStrip } from '@/components/photo-strip';
import { OrnCrossSection, OrnThumbStamp } from '@/components/ornaments';
import { GALLERIES } from '@/lib/galleries';
import { BATCHES_SORTED, type BatchNote } from '@/lib/batches';
import { getKitchen } from '@/lib/kitchen';

const MONTHS = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];

function formatBatchDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${MONTHS[parseInt(m, 10) - 1]} ${parseInt(d, 10)}, ${y}`;
}

const kitchen = getKitchen();

export const metadata: Metadata = {
  title: kitchen.metaTitle,
  description: kitchen.metaDescription,
};

/**
 * /kitchen/ — image-led batch log.
 *
 * v1 ships honestly: hero + small placeholder for the batch grid, and
 * the existing bagel/bread/pizza galleries as photo strips (rendering
 * empty-state placeholders until Wally uploads). When BATCHES grows
 * entries, the featured-curve hero (OrnBakeCurve at large size with
 * STEAM/BAKE/COOL phase markers) + batch cards drop in.
 *
 * Editorial copy lives in content/kitchen.mdx (loaded above). Composition
 * stays here — galleries, batch-list integration, and the section chrome.
 */
export default function KitchenPage() {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-10 pb-20">
      <Hero />
      <BagelsSection />
      <PracticeSection />
    </div>
  );
}

function Hero() {
  return (
    <section className="pt-16 sm:pt-24 pb-10 sm:pb-12 max-w-[900px] relative">
      <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-honey mb-5">
        {kitchen.eyebrow}
      </div>
      <h1
        className="font-serif text-[40px] sm:text-[52px] @[1100px]:text-[60px] leading-[1.04] tracking-[-0.018em] text-ink mb-6 [text-wrap:balance]"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
      >
        {kitchen.heading}
      </h1>
      <p
        className="font-serif text-[18px] sm:text-[20px] leading-[1.55] text-ink-muted max-w-[680px] [text-wrap:pretty]"
        style={{ fontVariationSettings: '"opsz" 24, "wght" 400' }}
      >
        {kitchen.dek}
      </p>
    </section>
  );
}

function BagelsSection() {
  const photos = GALLERIES.baking_bagels;
  const bagelBatches = BATCHES_SORTED.filter((b) => b.kind === 'bagel');
  return (
    <section className="mt-2 pt-10 border-t border-paper-edge">
      <div className="flex items-baseline justify-between flex-wrap gap-4 mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <OrnCrossSection width={64} height={48} />
          <div>
            <div className="font-mono text-[10.5px] tracking-stat uppercase text-honey">
              {kitchen.bagelsEyebrow}
            </div>
            <h2
              className="font-serif text-[26px] sm:text-[30px] leading-[1.18] text-ink"
              style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
            >
              {kitchen.bagelsHeading}
            </h2>
          </div>
        </div>
        {bagelBatches.length === 0 ? (
          <OrnThumbStamp>{kitchen.bagelsEmptyStamp}</OrnThumbStamp>
        ) : (
          <OrnThumbStamp>BATCH {bagelBatches[0].number}</OrnThumbStamp>
        )}
      </div>

      {bagelBatches.length === 0 ? (
        <p className="font-serif italic text-[17px] leading-[1.5] text-ink-muted max-w-[640px] [text-wrap:pretty] mb-4">
          {kitchen.bagelsEmpty}
        </p>
      ) : (
        <div className="mt-6 mb-10 space-y-12">
          {bagelBatches.map((batch) => (
            <BatchCard key={batch.slug} batch={batch} />
          ))}
        </div>
      )}

      <PhotoStrip
        photos={photos}
        layout="strip"
        emptyHint={kitchen.bagelsPhotosHint}
      />
    </section>
  );
}

function BatchCard({ batch }: { batch: BatchNote }) {
  const hasStats = !!(batch.hydration || batch.ferment || batch.oven);
  return (
    <article className="max-w-[720px]">
      <div className="font-mono text-[10.5px] tracking-stat uppercase text-honey mb-2">
        Batch {batch.number} · {batch.kind} · {formatBatchDate(batch.date)}
      </div>
      <h3
        className="font-serif text-[22px] sm:text-[26px] leading-[1.2] tracking-[-0.012em] text-ink mb-4 [text-wrap:balance]"
        style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
      >
        {batch.title}
      </h3>

      {hasStats ? (
        <dl className="grid grid-cols-3 gap-x-6 gap-y-1 border-t border-b border-paper-edge py-3 mb-6 text-[12.5px]">
          {batch.hydration ? <StatPair label="Hydration" value={batch.hydration} /> : null}
          {batch.ferment ? <StatPair label="Ferment" value={batch.ferment} /> : null}
          {batch.oven ? <StatPair label="Oven" value={batch.oven} /> : null}
        </dl>
      ) : null}

      {batch.body ? (
        <div
          className="font-serif text-[17px] leading-[1.65] text-ink-muted [text-wrap:pretty] space-y-4 [&_p]:mb-0 [&_a]:text-ink [&_a]:border-b [&_a]:border-ink-faint [&_a:hover]:border-ink"
          style={{ fontVariationSettings: '"opsz" 18, "wght" 400' }}
        >
          <MDXRemote source={batch.body} />
        </div>
      ) : null}

      {batch.notes.length > 0 ? (
        <ul className="mt-5 list-disc pl-5 space-y-1 font-serif text-[15.5px] leading-[1.55] text-ink-muted marker:text-ink-faint">
          {batch.notes.map((n, i) => (
            <li key={i}>{n}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}

function StatPair({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] tracking-stat uppercase text-ink-faint">
        {label}
      </dt>
      <dd className="font-serif text-[14px] text-ink mt-0.5">{value}</dd>
    </div>
  );
}

function PracticeSection() {
  const breadPhotos = GALLERIES.baking_bread;
  const pizzaPhotos = GALLERIES.baking_pizza;
  return (
    <section className="mt-4 pt-10 border-t border-paper-edge">
      <div className="mb-8">
        <div className="font-mono text-[10.5px] tracking-stat uppercase text-honey mb-2">
          {kitchen.practiceEyebrow}
        </div>
        <h2
          className="font-serif text-[22px] sm:text-[26px] leading-[1.18] text-ink mb-3"
          style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
        >
          {kitchen.practiceHeading}
        </h2>
        <p className="font-serif italic text-[16px] sm:text-[17px] leading-[1.5] text-ink-muted max-w-[640px] [text-wrap:pretty]">
          {kitchen.practiceDek}
        </p>
      </div>

      <div className="grid grid-cols-1 @[1024px]:grid-cols-2 gap-8">
        <div>
          <div className="font-mono text-[10.5px] tracking-meta uppercase text-ink-soft mb-2">{kitchen.breadLabel}</div>
          <PhotoStrip photos={breadPhotos} layout="grid" emptyHint={kitchen.breadPhotosHint} />
        </div>
        <div>
          <div className="font-mono text-[10.5px] tracking-meta uppercase text-ink-soft mb-2">{kitchen.pizzaLabel}</div>
          <PhotoStrip photos={pizzaPhotos} layout="grid" emptyHint={kitchen.pizzaPhotosHint} />
        </div>
      </div>
    </section>
  );
}
