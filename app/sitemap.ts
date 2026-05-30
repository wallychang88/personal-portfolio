import type { MetadataRoute } from 'next';

/**
 * Static sitemap. The site has a small, enumerable route list; we hand-
 * roll the entries instead of crawling app/ at build time. When future
 * dynamic routes appear (writing/[slug], projects/[name]), they get
 * generateStaticParams-driven entries appended here.
 *
 * BASE_URL is overridable at build time so the same code can target
 * staging and production.
 */
const BASE_URL = process.env.SITE_URL ?? 'https://wallychang.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: Array<{ path: string; priority: number }> = [
    { path: '/',                  priority: 1.0 },
    { path: '/sweat/',            priority: 0.8 },
    { path: '/projects/doorpi/',  priority: 0.8 },
    { path: '/writing/',          priority: 0.6 },
    { path: '/kitchen/',          priority: 0.6 },
    { path: '/about/',            priority: 0.7 },
  ];
  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified,
    priority: r.priority,
  }));
}
