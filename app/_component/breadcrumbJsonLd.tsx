'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';

const BASE_URL = 'https://alalabd.com';

const segmentLabelMap: Record<string, string> = {
  about: 'من نحن',
  called: 'الألقاب والعزاوي',
  posts: 'المنشورات',
  login: 'تسجيل الدخول',
  signup: 'إنشاء حساب',
  profile: 'الملف الشخصي',
  dashboard: 'لوحة التحكم',
  'forgot-password': 'نسيت كلمة المرور',
  'verify-email': 'تأكيد البريد الإلكتروني',
  family: 'العائلات',
  'reset-password': 'إعادة تعيين كلمة المرور',
};

function getSegmentLabel(
  segment: string,
  index: number,
  allSegments: string[],
) {
  if (allSegments[0] === 'family' && index === 1) {
    return 'تفاصيل العائلة';
  }

  if (allSegments[0] === 'reset-password' && index === 1) {
    return 'تأكيد إعادة التعيين';
  }

  return segmentLabelMap[segment] ?? decodeURIComponent(segment).replace(/-/g, ' ');
}

export default function BreadcrumbJsonLd() {
  const pathname = usePathname() || '/';
  const segments = pathname.split('/').filter(Boolean);

  const itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item: string;
  }> = [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'شبكة آل العبد',
      item: `${BASE_URL}/`,
    },
  ];

  let currentPath = '';

  segments.forEach((segment, index) => {
    currentPath += `/${segment}`;
    itemListElement.push({
      '@type': 'ListItem',
      position: index + 2,
      name: getSegmentLabel(segment, index, segments),
      item: `${BASE_URL}${currentPath}`,
    });
  });

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement,
  };

  const scriptId = `breadcrumb-jsonld-${pathname
    .replace(/^\//, '')
    .replace(/[^a-zA-Z0-9-]/g, '-') || 'home'}`;

  return (
    <Script
      id={scriptId}
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
    />
  );
}
