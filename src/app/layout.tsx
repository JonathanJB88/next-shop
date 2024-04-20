import type { Metadata } from 'next';

import { inter } from '@/config';

import './globals.css';

export const metadata: Metadata = {
  title: 'Joni | SHOP',
  description: 'Joni SHOP - The best place to buy your favorite products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
