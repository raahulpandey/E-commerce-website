import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: {
    default: 'ShopVault — Premium E-commerce Store',
    template: '%s | ShopVault',
  },
  description: 'Discover thousands of premium products at unbeatable prices. Fast delivery, secure payments, easy returns.',
  keywords: ['ecommerce', 'online shopping', 'buy online', 'ShopVault'],
  authors: [{ name: 'Rahul Pandey' }],
  openGraph: {
    type: 'website',
    title: 'ShopVault — Premium E-commerce Store',
    description: 'Shop the best deals on ShopVault.',
    siteName: 'ShopVault',
  },
  twitter: { card: 'summary_large_image' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white antialiased min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1 pt-16">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
