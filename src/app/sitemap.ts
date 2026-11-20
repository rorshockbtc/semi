import type { MetadataRoute } from 'next';
import { SEMI_TRACKS } from '../data/semi-songs.ts';
import { SITE_URL } from '../lib/seo.ts';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date('2026-11-20T00:00:00Z');

  const corePages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/songs`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/gallery`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ];

  const songPages: MetadataRoute.Sitemap = SEMI_TRACKS.map((track) => ({
    url: `${SITE_URL}/songs/${track.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  return [...corePages, ...songPages];
}
