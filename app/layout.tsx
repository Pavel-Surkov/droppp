import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Droppp — обмен файлами по короткой ссылке и PIN',
  description:
    'Передавайте файлы между устройствами без регистрации: короткая ссылка, PIN-доступ, скачивание отдельных файлов или ZIP и автоматическое удаление по времени.',
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
