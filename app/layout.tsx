import type { Metadata } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import { Nav } from '@/components/nav';
import { Footer } from '@/components/footer';

// Editorial display serif — variable font, optical sizing on.
// Used for headlines, section labels, the "Wally Chang" wordmark.
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-serif',
  axes: ['opsz', 'SOFT'],
});

// Clean sans for UI and body copy.
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

// Mono for coordinates, schematic labels, code, stat numerals,
// time-band headers, and other "field notebook" texture.
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'Wally Chang — the anti-resume',
  description:
    'The anti-resume. A mix of things I find significant, not all professional. Data scientist at Extend, founder of RodSmith.',
  authors: [{ name: 'Wally Chang' }],
  openGraph: {
    title: 'Wally Chang',
    description: 'The anti-resume — get to know me.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="min-h-screen bg-paper text-ink antialiased">
        <Nav />
        {/* @container makes the main canvas a container-query root so
            descendants can use arbitrary @[768px]: / @[1100px]: spans
            for bento layout. */}
        <main className="@container">{children}</main>
        <Footer />
        {/* First-party, cookie-less. Loads only in production via the
            package's NODE_ENV guard — no script on `pnpm dev`. */}
        <Analytics />
      </body>
    </html>
  );
}
