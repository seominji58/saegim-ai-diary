import type { Metadata } from 'next';
import ClientLayout from '@/components/layout/ClientLayout';
import './globals.css';

export const metadata: Metadata = {
  title: '새김 - 감성 AI 다이어리',
  description: 'AI와 함께 쓰는 감성 다이어리',
};

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
