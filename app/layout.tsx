import type { Metadata } from 'next';
import { Geist, Geist_Mono, Amiri } from 'next/font/google';
import './globals.css';
import NavBar from './_component/navBar';
import Providers from './providers';

const SITE_URL = 'https://alalabd.com';
const SITE_NAME = 'قبيلة آل العبد';
const SITE_DESCRIPTION = 'قبيلة آل العبد هي إحدى قبائل الحباب من قحطان';

const amiri = Amiri({
  subsets: ['arabic', 'latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-amiri',
});

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  applicationName: SITE_NAME,

  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },

  description: SITE_DESCRIPTION,

  alternates: {
    canonical: '/',
  },

  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },

  robots: {
    index: true,
    follow: true,
  },

  icons: {
    icon: '/favicon.ico',
  },
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  alternateName: ['شبكة ال العبد', 'آل العبد', 'قبيلة آل العبد'],
  url: `${SITE_URL}/`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ar' dir='rtl' className={amiri.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-card min-h-screen`}
      >
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, '\\u003c'),
          }}
        />

        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
