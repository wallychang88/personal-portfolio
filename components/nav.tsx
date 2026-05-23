import Link from 'next/link';

// Index → Projects → Endurance → Kitchen → Writing → About.
// Body registers (endurance, kitchen) sit before the reflective ones.
const NAV_ITEMS: { href: string; label: string }[] = [
  { href: '/', label: 'Index' },
  { href: '/projects/doorpi/', label: 'Projects' },
  { href: '/endurance/', label: 'Endurance' },
  { href: '/kitchen/', label: 'Kitchen' },
  { href: '/writing/', label: 'Writing' },
  { href: '/about/', label: 'About' },
];

export function Nav() {
  return (
    <header className="border-b border-paper-edge">
      <div className="max-w-page mx-auto px-6 sm:px-10 py-6 flex items-baseline justify-between">
        <Link
          href="/"
          className="font-serif text-[22px] font-medium tracking-tight text-ink hover:opacity-70 transition-opacity"
          style={{ fontVariationSettings: '"opsz" 36, "wght" 500' }}
        >
          Wally Chang
        </Link>
        <nav>
          <ul className="flex items-center gap-5 sm:gap-6 text-[12px] uppercase tracking-eyebrow text-ink-soft">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="hover:text-ink transition-colors"
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
