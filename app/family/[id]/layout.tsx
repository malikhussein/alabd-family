import { Metadata } from 'next';
import { getDb } from '../../../lib/db';

interface Params {
  id: string;
}

interface Props {
  params: Promise<Params>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const db = await getDb();
  const [familyData] = await db.query(
    'SELECT family_name AS "familyName", family_info AS "familyInfo" FROM family_data WHERE id = $1 LIMIT 1',
    [Number(id)],
  );

  if (!familyData) {
    return {
      title: 'صفحة غير موجودة',
    };
  }

  return {
    title: `${familyData.familyName}`,
    description:
      familyData.familyInfo?.substring(0, 160) ||
      `معلومات عن عائلة ${familyData.familyName} في قبيلة آل العبد`,
    keywords: [familyData.familyName, 'قبيلة آل العبد', 'عائلة', 'نسب'],
    openGraph: {
      title: `${familyData.familyName} | قبيلة آل العبد`,
      description:
        familyData.familyInfo?.substring(0, 160) ||
        `معلومات عن عائلة ${familyData.familyName} في قبيلة آل العبد`,
      url: `https://alalabd.com/family/${id}`,
      type: 'website',
    },
    alternates: {
      canonical: `https://alalabd.com/family/${id}`,
    },
  };
}

export default function FamilyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
