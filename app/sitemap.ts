import type { MetadataRoute } from 'next';
import { getAllProjects } from '@/lib/projects';

/**
 * Static sitemap. The site has a small, enumerable route list; we hand-
 * roll the page entries and append the project deep-dives from
 * content/projects/*.mdx so new ones show up automatically. When other
 * dynamic routes appear (writing/[slug]), add a generateStaticParams-
 * driven block here the same way.
 *
 * BASE_URL is overridable at build time so the same code can target
 * staging and production.
 */
const BASE_URL = process.env.SITE_URL ?? 'https://wallychang.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const routes: Array<{ path: string; priority: number }> = [
    { path: '/',           priority: 1.0 },
    { path: '/projects/',  priority: 0.8 },
    { path: '/sweat/',     priority: 0.8 },
    { path: '/writing/',   priority: 0.6 },
    { path: '/kitchen/',   priority: 0.6 },
    { path: '/about/',     priority: 0.7 },
  ];

  for (const project of getAllProjects()) {
    routes.push({ path: `/projects/${project.slug}/`, priority: 0.7 });
  }

  return routes.map((r) => ({
    url: `${BASE_URL}${r.path}`,
    lastModified,
    priority: r.priority,
  }));
}
