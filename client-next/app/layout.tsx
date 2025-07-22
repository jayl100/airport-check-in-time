// app/layout.tsx

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import { GoogleTagManager } from '@next/third-parties/google';
import GoogleAnalytics from '@/lib/GoogleAnalytics';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '공항 탑승시간 측정',
  description: '공항 대기시간 조회 서비스',
  icons: {
    icon: '/GDT_favicon.svg',
  },
};

export default function RootLayout({ children }: {children: React.ReactNode}) {
  return (
    <html lang="ko">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
    {process.env.NEXT_PUBLIC_GA ? (
      <>
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GA} />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA} />
      </>
    ) : null}
    </body>
    </html>
  );
}
