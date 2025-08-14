import type { Metadata } from 'next';
import ClientLayout from '@/components/layout/ClientLayout';
import './globals.css';
import { Noto_Sans_KR, Noto_Serif_KR } from 'next/font/google';

export const metadata: Metadata = {
  title: '새김 - 감성 AI 다이어리',
  description: 'AI와 함께 쓰는 감성 다이어리',
};

const notoSansKr = Noto_Sans_KR({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-sans',
});

const notoSerifKr = Noto_Serif_KR({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-noto-serif',
  weight: ['400', '500', '600', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen text-text-primary dark:bg-background-dark-primary dark:text-text-dark-primary transition-colors bg-[#e5f0ef]">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
