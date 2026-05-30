import Link from 'next/link';

// Index → Projects → Sweat → Kitchen → Writing → About.
// Body registers (sweat, kitchen) sit before the reflective ones.
const NAV_ITEMS: { href: string; label: string }[] = [
  { href: '/', label: 'Index' },
  { href: '/projects/doorpi/', label: 'Projects' },
  { href: '/sweat/', label: 'Sweat' },
  { href: '/kitchen/', label: 'Kitchen' },
  { href: '/writing/', label: 'Writing' },
  { href: '/about/', label: 'About' },
];

export function Nav() {
  return (
    <header className="border-b border-paper-edge">
      <div className="max-w-page mx-auto px-6 sm:px-10 py-4 sm:py-6 flex flex-col gap-2 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
        <Link
          href="/"
          className="font-serif text-[20px] sm:text-[22px] font-medium tracking-tight text-ink hover:opacity-70 transition-opacity"
          style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
        >
          Wally Chang
        </Link>
        <nav aria-label="Primary">
          <ul className="-mx-2 flex flex-wrap items-center gap-x-3 gap-y-0 sm:gap-x-5 lg:gap-x-6 text-[11px] sm:text-[12px] uppercase tracking-eyebrow text-ink-soft">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block px-2 py-1.5 hover:text-ink transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
