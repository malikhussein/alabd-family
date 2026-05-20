import type { MetadataRoute } from 'next';
import { FamilyData } from '../entities/family-data.entity';
import { getDb } from '../lib/db';

const SITE_URL = 'https://alalabd.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const db = await getDb();
  const familyDataRepo = db.getRepository(FamilyData);

  const families = await familyDataRepo.find({
    select: ['id'],
    order: { id: 'ASC' },
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/posts`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${SITE_URL}/called`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  const familyRoutes: MetadataRoute.Sitemap = families.map((family) => ({
    url: `${SITE_URL}/family/${family.id}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...familyRoutes];
}

export const dynamic = 'force-dynamic';
