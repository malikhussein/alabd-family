import { Geist, Geist_Mono, Amiri } from 'next/font/google';
import './globals.css';
import NavBar from './_component/navBar';
import Providers from './providers';

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

export const metadata = {
  metadataBase: new URL('https://alalabd.com'),
  title: {
    default: 'قبيلة آل العبد',
    template: '%s | قبيلة آل العبد',
  },
  description: 'قبيلة آل العبد هي إحدى قبائل الحباب من قحطان',
  applicationName: 'قبيلة آل العبد',
  keywords: ['قبيلة آل العبد', 'قبيلة ال العبد', 'آل العبد', 'Alalabd', 'قبائل قحطان', 'قبائل الحباب', 'العرب الأصيلة'],
  authors: [{ name: 'قبيلة آل العبد' }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://alalabd.com/',
  },
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    url: 'https://alalabd.com/',
    siteName: 'قبيلة آل العبد',
    title: 'قبيلة آل العبد',
    description: 'قبيلة آل العبد هي إحدى قبائل الحباب من قحطان',
    images: [
      {
        url: 'https://alalabd.com/logo.png',
        width: 1200,
        height: 630,
        alt: 'قبيلة آل العبد',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'قبيلة آل العبد',
    description: 'قبيلة آل العبد هي إحدى قبائل الحباب من قحطان',
    images: ['https://alalabd.com/logo.png'],
    creator: '@alalabd',
  },
  verification: {
    google: 'your-google-verification-code',
  },
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
        <Providers>
          <NavBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
