import type { MetadataRoute } from 'next';
import { SITE_URL } from '../lib/seo.ts';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/subscribe', '/api/unsubscribe', '/api/semi-chat'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
