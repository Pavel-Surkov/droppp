import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
const title = 'Droppp — обмен файлами по короткой ссылке и PIN';
const description =
  'Передавайте файлы между устройствами без регистрации: короткая ссылка, PIN-доступ, скачивание отдельных файлов или ZIP и автоматическое удаление по времени.';

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title,
  description,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: 'Droppp',
    title,
    description,
    images: [
      {
        url: '/og.jpg',
        width: 1200,
        height: 630,
        alt: 'Droppp',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/og.jpg'],
  },
};

type RootLayoutProps = {
  children: ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ru">
      <Analytics />
      <body>{children}</body>
    </html>
  );
}
