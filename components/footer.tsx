import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-paper-edge mt-32">
      <div className="max-w-page mx-auto px-6 sm:px-10 py-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <div className="font-serif italic text-xl text-ink">Wally Chang</div>
          <div className="text-sm text-ink-soft mt-1">
            San Francisco · Data Scientist at Extend · Founder of RodSmith
          </div>
        </div>
        <ul className="flex gap-6 text-[12px] uppercase tracking-eyebrow text-ink-soft">
          <li>
            <a
              href="mailto:wallychang88@gmail.com"
              className="hover:text-ink transition-colors"
            >
              Email
            </a>
          </li>
          <li>
            <a
              href="https://github.com/wallychang88"
              className="hover:text-ink transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </li>
          <li>
            <Link href="/about/" className="hover:text-ink transition-colors">
              Colophon
            </Link>
          </li>
        </ul>
      </div>
      <div className="max-w-page mx-auto px-6 sm:px-10 pb-10 text-xs text-ink-faint">
        © {new Date().getFullYear()} Walter S. Chang. Built with Next.js, hosted as
        static HTML.
      </div>
    </footer>
  );
}
