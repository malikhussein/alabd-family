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
