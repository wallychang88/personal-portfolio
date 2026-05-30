import Link from 'next/link';

export const metadata = {
  title: 'Not found — Wally Chang',
};

/**
 * 404 page — same chrome as the rest of the site (the layout's <Nav/>
 * + <Footer/> wrap it), but the route content is editorial rather than
 * the default Next.js "404". Sits at the not-yet-written register so
 * a busted link feels like a quiet aside, not an error.
 */
export default function NotFound() {
  return (
    <div className="max-w-page mx-auto px-6 sm:px-10 pt-20 sm:pt-28 pb-24 max-w-[760px]">
      <div className="text-[11px] font-sans font-semibold tracking-eyebrow uppercase text-ink-faint mb-5">
        404 · not found
      </div>
      <h1
        className="font-serif text-[40px] sm:text-[52px] leading-[1.05] tracking-[-0.018em] text-ink mb-5 [text-wrap:balance]"
        style={{ fontVariationSettings: '"opsz" 144, "wght" 400' }}
      >
        This page hasn&rsquo;t been written yet.
      </h1>
      <p className="font-serif italic text-[18px] sm:text-[20px] leading-[1.5] text-ink-muted mb-9 [text-wrap:pretty]">
        Some of the routes on this site exist; some are placeholders for
        things I haven&rsquo;t finished. The link you followed lands in
        the second category.
      </p>

      <div className="space-y-2 font-mono text-[12px] text-ink-soft">
        <Link href="/" className="block hover:text-ink transition-colors">
          → return to the index
        </Link>
        <Link href="/sweat/" className="block hover:text-ink transition-colors">
          → /sweat/ — the trophy days
        </Link>
        <Link href="/projects/doorpi/" className="block hover:text-ink transition-colors">
          → /projects/doorpi/ — the door
        </Link>
        <Link href="/writing/" className="block hover:text-ink transition-colors">
          → /writing/ — slow notes
        </Link>
        <Link href="/kitchen/" className="block hover:text-ink transition-colors">
          → /kitchen/ — sunday bagels
        </Link>
        <Link href="/about/" className="block hover:text-ink transition-colors">
          → /about/ — bio + colophon
        </Link>
      </div>
    </div>
  );
}
