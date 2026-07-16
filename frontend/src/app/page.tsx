import type { Metadata } from 'next';
import { HeroBanner } from '@/components/home/HeroBanner';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { PromoStrip } from '@/components/home/PromoStrip';

export const metadata: Metadata = {
  title: 'ShopVault — Premium E-commerce Store',
  description: 'Discover thousands of premium products at unbeatable prices.',
};

export default function HomePage() {
  return (
    <>
      <HeroBanner />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CategoryGrid />
        <FeaturedProducts />
        <PromoStrip />
      </div>
    </>
  );
}
