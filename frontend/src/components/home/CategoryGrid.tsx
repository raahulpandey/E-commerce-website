'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState } from 'react';

const CATEGORIES = [
  {
    name: "Women's Fashion",
    slug: 'womens-dresses',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    tag: 'UP TO 70% OFF',
    tagColor: '#FF3F6C',
    count: '2000+ styles',
  },
  {
    name: "Men's Fashion",
    slug: 'mens-shirts',
    image: 'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&q=80',
    tag: 'NEW IN',
    tagColor: '#3b82f6',
    count: '1500+ styles',
  },
  {
    name: 'Smartphones',
    slug: 'smartphones',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
    tag: 'BEST DEALS',
    tagColor: '#f59e0b',
    count: '500+ products',
  },
  {
    name: 'Laptops',
    slug: 'laptops',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=80',
    tag: 'PREMIUM',
    tagColor: '#6366f1',
    count: '200+ models',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&q=80',
    tag: 'EXCLUSIVE',
    tagColor: '#ec4899',
    count: '800+ products',
  },
  {
    name: 'Footwear',
    slug: 'mens-shoes',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    tag: 'UPTO 50% OFF',
    tagColor: '#f97316',
    count: '1200+ pairs',
  },
  {
    name: 'Watches',
    slug: 'mens-watches',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80',
    tag: 'LUXURY',
    tagColor: '#92400e',
    count: '300+ watches',
  },
  {
    name: 'Skincare',
    slug: 'skin-care',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
    tag: 'GLOW UP',
    tagColor: '#0d9488',
    count: '400+ products',
  },
];

export function CategoryGrid() {
  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-black tracking-widest text-[#FF3F6C] uppercase mb-1">Browse</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Shop By Category</h2>
        </div>
        <Link href="/categories"
          className="hidden sm:inline-flex items-center text-sm font-black text-[#FF3F6C] border-2 border-[#FF3F6C] px-5 py-2.5 rounded-full hover:bg-[#FF3F6C] hover:text-white transition-all duration-300">
          VIEW ALL →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {CATEGORIES.map((cat, i) => {
          const [imgErr, setImgErr] = useState(false);
          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link href={`/shop?category=${cat.slug}`}>
                <div className="group relative overflow-hidden rounded-2xl cursor-pointer" style={{ aspectRatio: '3/4' }}>
                  {/* Image */}
                  {!imgErr ? (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-600"
                      onError={() => setImgErr(true)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />

                  {/* Tag */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-white text-[10px] font-black rounded-md tracking-wide"
                      style={{ backgroundColor: cat.tagColor }}>
                      {cat.tag}
                    </span>
                  </div>

                  {/* Bottom content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-black text-lg leading-tight">{cat.name}</p>
                    <p className="text-white/60 text-xs mt-0.5">{cat.count}</p>
                    <div className="mt-2 overflow-hidden h-0 group-hover:h-7 transition-all duration-300">
                      <span className="inline-block text-[10px] bg-white text-slate-900 font-black px-3 py-1.5 rounded-full tracking-wide">
                        SHOP NOW →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
