import type { Metadata } from 'next';
import { HeroBannerMyntra } from '@/components/home/HeroBanner';
import { OfferMarquee } from '@/components/home/OfferMarquee';
import { CategoryGrid } from '@/components/home/CategoryGrid';
import { DealsSection } from '@/components/home/DealsSection';
import { BrandsSection } from '@/components/home/BrandsSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { PromoStrip } from '@/components/home/PromoStrip';

export const metadata: Metadata = {
  title: 'ShopVault — Fashion, Electronics & More | India\'s Premium Store',
  description: 'Shop the latest fashion, electronics, beauty & lifestyle products at ShopVault. Upto 70% off on top brands. Free delivery above ₹499.',
};

export default function HomePage() {
  return (
    <>
      {/* Scrolling offer marquee */}
      <OfferMarquee />

      {/* Full-screen hero carousel */}
      <HeroBannerMyntra />

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Deals of the Day with countdown timer */}
        <DealsSection />

        {/* Category grid — Myntra style cards */}
        <CategoryGrid />

        {/* Brands showcase + trending collection banners */}
        <BrandsSection />

        {/* Featured products from DB */}
        <FeaturedProducts />

        {/* Trust & promo strip */}
        <PromoStrip />
      </div>
    </>
  );
}
