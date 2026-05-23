import type { Metadata } from 'next';
import { PhotoStrip } from '@/components/photo-strip';
import { OrnCrossSection, OrnThumbStamp } from '@/components/ornaments';
import { GALLERIES } from '@/lib/galleries';
import { BATCHES_SORTED } from '@/lib/batches';

export const metadata: Metadata = {
  title: 'Kitchen — Wally Chang',
  description:
    'Bagels are the trophy. Bread and pizza are practice. Batch notes land here when the bake is worth writing down.',
};

/**
 * /kitchen/ — image-led batch log.
 *
 * v1 ships honestly: hero + small placeholder for the batch grid, and
 * the existing bagel/bread/pizza galleries as photo strips (rendering
 * empty-state placeholders until Wally uploads). When BATCHES grows
 * entries, the featured-curve hero (OrnBakeCurve at large size with
 * STEAM/BAKE/COOL phase markers) + batch cards drop in.
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
        Kitchen · ongoing
      </div>
      <h1
        className="font-serif text-[40px] sm:text-[52px] @[1100px]:text-[60px] leading-[1.04] tracking-[-0.018em] text-ink mb-6 [text-wrap:balance]"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
      >
        Bagels are the trophy. Bread and pizza are practice.
      </h1>
      <p
        className="font-serif text-[18px] sm:text-[20px] leading-[1.55] text-ink-muted max-w-[680px] [text-wrap:pretty]"
        style={{ fontVariationSettings: '"opsz" 24, "wght" 400' }}
      >
        I bake bagels on Sunday mornings because the dough doesn&rsquo;t
        care whether I had a good week. The page below is the file of
        what came out of the oven — batch numbers when the bake is worth
        writing down, photos when the loaf wants to be looked at.
      </p>
    </section>
  );
}

function BagelsSection() {
  const photos = GALLERIES.baking_bagels;
  return (
    <section className="mt-2 pt-10 border-t border-paper-edge">
      <div className="flex items-baseline justify-between flex-wrap gap-4 mb-2">
        <div className="flex items-center gap-3 flex-wrap">
          <OrnCrossSection width={64} height={48} />
          <div>
            <div className="font-mono text-[10.5px] tracking-stat uppercase text-honey">
              Section · trophy bake
            </div>
            <h2
              className="font-serif text-[26px] sm:text-[30px] leading-[1.18] text-ink"
              style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
            >
              Bagels.
            </h2>
          </div>
        </div>
        {BATCHES_SORTED.length === 0 ? (
          <OrnThumbStamp>NO BATCH YET</OrnThumbStamp>
        ) : (
          <OrnThumbStamp>BATCH {BATCHES_SORTED[0].number}</OrnThumbStamp>
        )}
      </div>

      {BATCHES_SORTED.length === 0 ? (
        <p className="font-serif italic text-[17px] leading-[1.5] text-ink-muted max-w-[640px] [text-wrap:pretty] mb-4">
          The first batch worth writing up is in revision. When it lands
          you&rsquo;ll see the ratios, the ferment, the oven temperatures,
          and — eventually — the crumb shot it earned.
        </p>
      ) : null}

      <PhotoStrip
        photos={photos}
        layout="strip"
        emptyHint="Bagel photos coming — the trophy bake earns the camera time."
      />
    </section>
  );
}

function PracticeSection() {
  const breadPhotos = GALLERIES.baking_bread;
  const pizzaPhotos = GALLERIES.baking_pizza;
  return (
    <section className="mt-4 pt-10 border-t border-paper-edge">
      <div className="mb-8">
        <div className="font-mono text-[10.5px] tracking-stat uppercase text-honey mb-2">
          Section · practice
        </div>
        <h2
          className="font-serif text-[22px] sm:text-[26px] leading-[1.18] text-ink mb-3"
          style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
        >
          Bread &amp; pizza.
        </h2>
        <p className="font-serif italic text-[16px] sm:text-[17px] leading-[1.5] text-ink-muted max-w-[640px] [text-wrap:pretty]">
          The bakes that aren&rsquo;t the headline. Sourdough loaves on
          the dutch-oven cycle, weekend pizzas, occasional experiments.
        </p>
      </div>

      <div className="grid grid-cols-1 @[1024px]:grid-cols-2 gap-8">
        <div>
          <div className="font-mono text-[10.5px] tracking-meta uppercase text-ink-soft mb-2">Bread</div>
          <PhotoStrip photos={breadPhotos} layout="grid" emptyHint="Loaf photos coming soon." />
        </div>
        <div>
          <div className="font-mono text-[10.5px] tracking-meta uppercase text-ink-soft mb-2">Pizza</div>
          <PhotoStrip photos={pizzaPhotos} layout="grid" emptyHint="Pizza photos coming soon." />
        </div>
      </div>
    </section>
  );
}
