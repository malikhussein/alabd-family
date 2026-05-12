import type { MetadataRoute } from 'next';

const SITE_URL = 'https://alalabd.com';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard', '/profile'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
