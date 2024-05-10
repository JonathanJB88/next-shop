import type { Metadata } from 'next';

import { inter } from '@/config';
import { Providers } from '@/components';

import './globals.css';

export const metadata: Metadata = {
  title: {
    template: '%s - Joni | SHOP',
    default: 'Home - Joni | SHOP',
  },
  description: 'Joni SHOP - The best place to buy your favorite products.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
