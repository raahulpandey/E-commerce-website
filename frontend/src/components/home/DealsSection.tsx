'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

// Deal ends 24 hours from page load
const DEAL_DURATION_MS = 24 * 60 * 60 * 1000;

const DEALS = [
  {
    id: 1,
    title: 'iPhone 15 128GB',
    brand: 'Apple',
    originalPrice: 79999,
    salePrice: 56999,
    discount: 29,
    image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015/1.webp',
    category: 'smartphones',
    emoji: '📱',
    soldPercent: 73,
  },
  {
    id: 2,
    title: 'MacBook Pro 14"',
    brand: 'Apple',
    originalPrice: 199900,
    salePrice: 149900,
    discount: 25,
    image: 'https://cdn.dummyjson.com/products/images/laptops/Apple%20MacBook%20Pro%2014%20Inch%20Space%20Grey/1.webp',
    category: 'laptops',
    emoji: '💻',
    soldPercent: 61,
  },
  {
    id: 3,
    title: 'Women Black Coat',
    brand: 'Trendy',
    originalPrice: 8999,
    salePrice: 3599,
    discount: 60,
    image: 'https://cdn.dummyjson.com/products/images/womens-dresses/Black%20Women%20Coat/1.webp',
    category: 'womens-dresses',
    emoji: '👗',
    soldPercent: 88,
  },
  {
    id: 4,
    title: 'Rolex Datejust',
    brand: 'Rolex',
    originalPrice: 1299999,
    salePrice: 923999,
    discount: 29,
    image: 'https://cdn.dummyjson.com/products/images/mens-watches/Rolex%20Datejust%2031mm/1.webp',
    category: 'mens-watches',
    emoji: '⌚',
    soldPercent: 42,
  },
  {
    id: 5,
    title: 'Eyeshadow Palette',
    brand: 'Glamour',
    originalPrice: 3999,
    salePrice: 1499,
    discount: 63,
    image: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.webp',
    category: 'beauty',
    emoji: '💄',
    soldPercent: 92,
  },
];

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ h: 23, m: 59, s: 59 });

  useEffect(() => {
    const end = Date.now() + DEAL_DURATION_MS;
    const tick = () => {
      const remaining = Math.max(0, end - Date.now());
      const h = Math.floor(remaining / 3600000);
      const m = Math.floor((remaining % 3600000) / 60000);
      const s = Math.floor((remaining % 60000) / 1000);
      setTimeLeft({ h, m, s });
    };
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return timeLeft;
}

function pad(n: number) { return String(n).padStart(2, '0'); }

export function DealsSection() {
  const { h, m, s } = useCountdown();

  return (
    <section className="py-12">
      {/* Header with countdown */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <div>
          <p className="text-xs font-bold tracking-widest text-[#FF3F6C] uppercase mb-1">Limited Time</p>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">Deals of the Day</h2>
        </div>

        {/* Countdown timer */}
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">Ends in:</span>
          {[{ v: h, l: 'HRS' }, { v: m, l: 'MIN' }, { v: s, l: 'SEC' }].map(({ v, l }, i) => (
            <div key={l} className="flex items-center gap-1">
              <div className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl w-14 h-14 flex flex-col items-center justify-center shadow-lg">
                <span className="text-xl font-black font-mono leading-none">{pad(v)}</span>
                <span className="text-[9px] font-bold tracking-widest mt-0.5 opacity-70">{l}</span>
              </div>
              {i < 2 && <span className="text-slate-900 dark:text-white font-black text-xl">:</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Deal cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {DEALS.map((deal, i) => {
          const [imgErr, setImgErr] = useState(false);
          return (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <Link href={`/shop?category=${deal.category}`}>
                <div className="bg-white dark:bg-slate-900 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-xl hover:shadow-[#FF3F6C]/10 transition-all duration-300 group">
                  {/* Image */}
                  <div className="relative aspect-square bg-slate-50 dark:bg-slate-800 overflow-hidden">
                    {!imgErr ? (
                      <img
                        src={deal.image}
                        alt={deal.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgErr(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-5xl">{deal.emoji}</div>
                    )}
                    {/* Discount badge */}
                    <div className="absolute top-2 left-2 bg-[#FF3F6C] text-white text-xs font-black px-2 py-0.5 rounded-lg">
                      -{deal.discount}%
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-3 space-y-1.5">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{deal.brand}</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">{deal.title}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="text-base font-black text-slate-900 dark:text-white">
                        ₹{deal.salePrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{deal.originalPrice.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Sold progress bar */}
                    <div>
                      <p className="text-[10px] text-slate-400 mb-1">{deal.soldPercent}% sold</p>
                      <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${deal.soldPercent}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                          className="h-full rounded-full bg-gradient-to-r from-[#FF3F6C] to-[#ff6b6b]"
                        />
                      </div>
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
