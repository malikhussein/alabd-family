import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./_component/navBar";
import BreadcrumbJsonLd from "./_component/breadcrumbJsonLd";
import { SessionProvider } from "next-auth/react";
import { Amiri } from "next/font/google";
const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-amiri",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://alalabd.com"),
  title: {
    default: "شبكة آل العبد",
    template: "%s | شبكة آل العبد",
  },
  description: "قبيلة آل العبد هي إحدى قبائل الحباب من قحطان",
  openGraph: {
    siteName: "شبكة آل العبد",
    title: "شبكة آل العبد",
    description: "قبيلة آل العبد هي إحدى قبائل الحباب من قحطان",
    url: "https://alalabd.com",
    locale: "ar_EG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={amiri.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-card min-h-screen `}
      >
        <SessionProvider>
          <BreadcrumbJsonLd />
          <NavBar />

          {children}
        </SessionProvider>
      </body>
    </html>
  );
}
