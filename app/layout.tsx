import { Inter } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from '@/components/providers';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ToDo x Auth0',
  description: 'A Next.js app, made using Auth0 and Upstash Redis.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <main className='md:mx-[10vw]'>{children}</main>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
