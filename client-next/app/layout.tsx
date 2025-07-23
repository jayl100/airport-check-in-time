import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '@/components/ReactQueryProvider';
import { GoogleTagManager, GoogleAnalytics } from '@next/third-parties/google';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: '실시간 공항 탑승 수속시간',
  description: '공항 대기시간 조회 서비스',
  icons: {
    icon: '/GDT_favicon.svg',
  },
};

export default function RootLayout({ children }: {children: React.ReactNode}) {
  const gaId = process.env.NEXT_PUBLIC_GA;
  const gtmId = process.env.NEXT_PUBLIC_GTM;

  return (
    <html lang="ko">
    <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
      <>
        <GoogleTagManager gtmId={gtmId!} />
        <GoogleAnalytics gaId={gaId!} />
      </>
    </body>
    </html>
  );
}
