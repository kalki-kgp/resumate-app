import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/dashboard/', '/editor/', '/cover-letter/'],
    },
    sitemap: 'https://resumate.paperknife.app/sitemap.xml',
  };
}
