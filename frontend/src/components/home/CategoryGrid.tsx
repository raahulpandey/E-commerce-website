'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useState } from 'react';

const CATEGORIES = [
  {
    name: "Women's Fashion",
    slug: 'womens-dresses',
    emoji: '👗',
    color: 'from-pink-400 to-rose-600',
    image: 'https://cdn.dummyjson.com/products/images/womens-dresses/Black%20Women%20Coat/1.webp',
    count: '2000+ styles',
    tag: 'Trending',
  },
  {
    name: "Men's Fashion",
    slug: 'mens-shirts',
    emoji: '👕',
    color: 'from-blue-400 to-indigo-600',
    image: 'https://cdn.dummyjson.com/products/images/mens-shirts/Blue%20&%20Black%20Check%20Shirt/1.webp',
    count: '1500+ styles',
    tag: 'New In',
  },
  {
    name: 'Electronics',
    slug: 'smartphones',
    emoji: '📱',
    color: 'from-gray-700 to-gray-900',
    image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015/1.webp',
    count: '500+ products',
    tag: 'Best Sellers',
  },
  {
    name: 'Beauty',
    slug: 'beauty',
    emoji: '💄',
    color: 'from-purple-400 to-pink-600',
    image: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.webp',
    count: '800+ products',
    tag: 'Exclusive',
  },
  {
    name: 'Footwear',
    slug: 'mens-shoes',
    emoji: '👟',
    color: 'from-amber-400 to-orange-600',
    image: 'https://cdn.dummyjson.com/products/images/mens-shoes/Casual%20Men%20Shoes/1.webp',
    count: '1200+ pairs',
    tag: 'Upto 50% Off',
  },
  {
    name: 'Watches',
    slug: 'mens-watches',
    emoji: '⌚',
    color: 'from-slate-600 to-slate-900',
    image: 'https://cdn.dummyjson.com/products/images/mens-watches/Brown%20Leather%20Belt%20Watch/1.webp',
    count: '300+ watches',
    tag: 'Premium',
  },
  {
    name: 'Bags',
    slug: 'womens-bags',
    emoji: '👜',
    color: 'from-rose-300 to-pink-500',
    image: 'https://cdn.dummyjson.com/products/images/womens-bags/Bag%20Set%203%20piece%20Faux%20Leather/1.webp',
    count: '600+ bags',
    tag: 'Stylish',
  },
  {
    name: 'Skincare',
    slug: 'skin-care',
    emoji: '🧴',
    color: 'from-green-400 to-teal-600',
    image: 'https://cdn.dummyjson.com/products/images/skin-care/Hyaluronic%20Acid%20Serum/1.webp',
    count: '400+ products',
    tag: 'Glow Up',
  },
];

export function CategoryGrid() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#FF3F6C] uppercase mb-1">Shop by Category</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">What Are You Looking For?</h2>
        </div>
        <Link href="/categories"
          className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#FF3F6C] border border-[#FF3F6C] px-5 py-2.5 rounded-full hover:bg-[#FF3F6C] hover:text-white transition-all duration-300">
          VIEW ALL →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {CATEGORIES.map((cat, i) => {
          const [imgErr, setImgErr] = useState(false);
          return (
            <motion.div
              key={cat.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
            >
              <Link href={`/shop?category=${cat.slug}`}>
                <div className={`relative overflow-hidden rounded-2xl aspect-[3/4] bg-gradient-to-br ${cat.color} cursor-pointer group`}>
                  {/* Product image */}
                  {!imgErr ? (
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover opacity-70 group-hover:opacity-90 group-hover:scale-110 transition-all duration-500"
                      onError={() => setImgErr(true)}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl">
                      {cat.emoji}
                    </div>
                  )}

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Tag badge */}
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 bg-white text-[#FF3F6C] text-xs font-black rounded-full tracking-wide">
                      {cat.tag}
                    </span>
                  </div>

                  {/* Text content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-black text-lg leading-tight">{cat.name}</p>
                    <p className="text-white/70 text-xs mt-1">{cat.count}</p>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: hovered === i ? 1 : 0, y: hovered === i ? 0 : 8 }}
                      transition={{ duration: 0.25 }}
                      className="mt-2"
                    >
                      <span className="inline-block text-xs bg-white text-slate-900 font-bold px-3 py-1 rounded-full">
                        EXPLORE →
                      </span>
                    </motion.div>
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
