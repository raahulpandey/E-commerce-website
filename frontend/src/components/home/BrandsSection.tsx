'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const BRANDS = [
  { name: 'Apple', emoji: '🍎', color: '#1d1d1f', bg: '#f5f5f7', desc: 'Think Different', slug: 'smartphones' },
  { name: 'Samsung', emoji: '📱', color: '#1428A0', bg: '#e8ecff', desc: 'Do What You Can\'t', slug: 'smartphones' },
  { name: 'Rolex', emoji: '⌚', color: '#8B6914', bg: '#fdf8ee', desc: 'A Crown For Every Achievement', slug: 'mens-watches' },
  { name: 'Nike', emoji: '👟', color: '#111', bg: '#f5f5f5', desc: 'Just Do It', slug: 'mens-shoes' },
  { name: 'L\'Oréal', emoji: '💄', color: '#B40000', bg: '#fff0f0', desc: 'Because You\'re Worth It', slug: 'beauty' },
  { name: 'Prada', emoji: '👜', color: '#2C2C2C', bg: '#fafafa', desc: 'Luxury Redefined', slug: 'womens-bags' },
];

const OFFER_BANNERS = [
  {
    title: 'WOMEN\'S FASHION',
    sub: 'UP TO 70% OFF',
    desc: 'Latest trends, premium quality',
    href: '/shop?category=womens-dresses',
    bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    emoji: '👗',
  },
  {
    title: 'MEN\'S COLLECTION',
    sub: 'STARTING ₹299',
    desc: 'Casual to Formal — everything',
    href: '/shop?category=mens-shirts',
    bg: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    emoji: '👔',
  },
  {
    title: 'TECH FESTIVAL',
    sub: 'UP TO 40% OFF',
    desc: 'Smartphones, Laptops & more',
    href: '/shop?category=smartphones',
    bg: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)',
    emoji: '⚡',
  },
];

export function BrandsSection() {
  return (
    <section className="py-12 space-y-16">
      {/* Top brands */}
      <div>
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-[#FF3F6C] uppercase mb-1">Premium Selection</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Shop Top Brands</h2>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {BRANDS.map((brand, i) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ scale: 1.05, y: -4 }}
            >
              <Link href={`/shop?category=${brand.slug}`}>
                <div
                  className="rounded-2xl p-4 flex flex-col items-center gap-2 text-center cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300 hover:shadow-lg"
                  style={{ backgroundColor: brand.bg }}
                >
                  <span className="text-4xl">{brand.emoji}</span>
                  <p className="text-sm font-black" style={{ color: brand.color }}>{brand.name}</p>
                  <p className="text-[10px] text-slate-400 hidden sm:block">{brand.desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Offer banners row */}
      <div>
        <div className="text-center mb-8">
          <p className="text-xs font-bold tracking-widest text-[#FF3F6C] uppercase mb-1">Exclusive Offers</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Trending Collections</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {OFFER_BANNERS.map((banner, i) => (
            <motion.div
              key={banner.title}
              initial={{ opacity: 0, x: i === 1 ? 0 : i === 0 ? -30 : 30, y: i === 1 ? 30 : 0 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
            >
              <Link href={banner.href}>
                <div
                  className={`rounded-3xl p-8 flex flex-col justify-between text-white cursor-pointer overflow-hidden group relative ${i === 1 ? 'sm:mt-8' : ''}`}
                  style={{ background: banner.bg, minHeight: '220px' }}
                >
                  {/* Background emoji */}
                  <span className="absolute -right-4 -bottom-4 text-9xl opacity-20 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500 select-none">
                    {banner.emoji}
                  </span>

                  <div className="space-y-2 relative z-10">
                    <p className="text-xs font-black tracking-widest opacity-80 uppercase">{banner.title}</p>
                    <p className="text-3xl font-black leading-none">{banner.sub}</p>
                    <p className="text-sm opacity-70">{banner.desc}</p>
                  </div>

                  <div className="relative z-10 mt-6">
                    <span className="inline-block bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white text-sm font-bold px-5 py-2.5 rounded-full transition-all group-hover:px-7">
                      SHOP NOW →
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
