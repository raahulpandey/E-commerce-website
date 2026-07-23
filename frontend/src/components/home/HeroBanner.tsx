'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'END OF SEASON SALE',
    headline: ['UP TO', '70% OFF'],
    sub: 'Top Fashion, Electronics & Lifestyle',
    cta: 'SHOP NOW',
    ctaSecondary: 'VIEW CATEGORIES',
    href: '/shop',
    hrefSecondary: '/categories',
    bg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
    accent: '#FF3F6C',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&q=80',
    badge: '🔥 Trending Now',
    stats: [{ v: '10M+', l: 'Products' }, { v: '5M+', l: 'Happy Customers' }, { v: '50K+', l: 'Brands' }],
  },
  {
    id: 2,
    tag: 'NEW ARRIVALS — SUMMER 2026',
    headline: ['FRESH STYLES', 'FOR YOU'],
    sub: 'Latest trends delivered to your door',
    cta: 'SHOP WOMEN',
    ctaSecondary: 'SHOP MEN',
    href: '/shop?category=womens-dresses',
    hrefSecondary: '/shop?category=mens-shirts',
    bg: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    accent: '#fff',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
    badge: '✨ Just Launched',
    stats: [{ v: '70%', l: 'Off Fashion' }, { v: 'FREE', l: 'Delivery' }, { v: '30-Day', l: 'Returns' }],
  },
  {
    id: 3,
    tag: 'ELECTRONICS MEGA FEST',
    headline: ['BEST DEALS', 'ON TECH'],
    sub: 'Smartphones • Laptops • Tablets & more',
    cta: 'GRAB DEALS',
    ctaSecondary: 'VIEW ALL TECH',
    href: '/shop?category=smartphones',
    hrefSecondary: '/shop?category=laptops',
    bg: 'linear-gradient(135deg, #000000 0%, #1a1a2e 50%, #16213e 100%)',
    accent: '#FFD700',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80',
    badge: '⚡ Flash Sale Live',
    stats: [{ v: '40%', l: 'Off Electronics' }, { v: 'EMI', l: '0% Interest' }, { v: '2yr', l: 'Warranty' }],
  },
  {
    id: 4,
    tag: 'BEAUTY & SKINCARE',
    headline: ['GLOW UP', 'THIS SEASON'],
    sub: 'Premium brands. Real results.',
    cta: 'SHOP BEAUTY',
    ctaSecondary: 'SKINCARE EDIT',
    href: '/shop?category=beauty',
    hrefSecondary: '/shop?category=skin-care',
    bg: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    accent: '#fff',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=800&q=80',
    badge: '💄 Beauty Sale',
    stats: [{ v: '500+', l: 'Brands' }, { v: '63%', l: 'Max Discount' }, { v: '4.8★', l: 'Avg Rating' }],
  },
];

export function HeroBannerMyntra() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 5000);
  }, []);

  useEffect(() => { startTimer(); return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, [startTimer]);

  const goTo = (idx: number) => { setCurrent(idx); startTimer(); };
  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);
  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 'calc(100vh - 60px)', minHeight: 520, maxHeight: 800 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
          style={{ background: slide.bg }}
        >
          {/* Right side: full-bleed image */}
          <div className="absolute right-0 top-0 bottom-0 w-1/2 hidden lg:block">
            {!imgErrors[slide.id] ? (
              <motion.img
                key={slide.id}
                initial={{ scale: 1.08, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8 }}
                src={slide.image}
                alt={slide.headline.join(' ')}
                className="w-full h-full object-cover"
                onError={() => setImgErrors(p => ({ ...p, [slide.id]: true }))}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-9xl opacity-30">
                {slide.badge?.split(' ')[0]}
              </div>
            )}
            {/* Image overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/20 to-transparent" />
          </div>

          {/* Mobile full-bleed image */}
          <div className="absolute inset-0 lg:hidden">
            {!imgErrors[slide.id] && (
              <img src={slide.image} alt="" className="w-full h-full object-cover opacity-30" onError={() => setImgErrors(p => ({ ...p, [slide.id]: true }))} />
            )}
            <div className="absolute inset-0 bg-black/50" />
          </div>

          {/* Content */}
          <div className="relative z-10 h-full flex items-center px-8 lg:px-16 max-w-7xl mx-auto">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-xl space-y-5"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-white/15 backdrop-blur-md text-white border border-white/20">
                {slide.badge}
              </div>

              {/* Tag */}
              <p className="text-xs font-black tracking-[0.4em] uppercase opacity-80" style={{ color: slide.accent }}>
                {slide.tag}
              </p>

              {/* Headline */}
              <h1 className="text-6xl sm:text-7xl font-black text-white leading-[0.95] tracking-tight">
                {slide.headline[0]}<br />
                <span style={{ color: slide.accent }}>{slide.headline[1]}</span>
              </h1>

              {/* Sub */}
              <p className="text-lg text-white/75 font-medium">{slide.sub}</p>

              {/* Stats row */}
              <div className="flex gap-6 py-2 border-y border-white/15">
                {slide.stats.map(s => (
                  <div key={s.l}>
                    <p className="text-2xl font-black text-white">{s.v}</p>
                    <p className="text-xs text-white/60 font-medium">{s.l}</p>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex gap-3 flex-wrap">
                <Link href={slide.href}
                  className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-black tracking-widest rounded-full text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                  style={{ backgroundColor: slide.accent === '#fff' ? '#FF3F6C' : slide.accent }}>
                  {slide.cta} →
                </Link>
                <Link href={slide.hrefSecondary}
                  className="inline-flex items-center px-7 py-3.5 text-sm font-bold tracking-widest rounded-full border-2 border-white/40 text-white hover:bg-white/15 transition-all duration-300">
                  {slide.ctaSecondary}
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Slide dots */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => goTo(i)}
                className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`} />
            ))}
          </div>

          {/* Arrows */}
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110">
            <ChevronRight className="h-4 w-4" />
          </button>

          {/* Counter */}
          <div className="absolute bottom-6 right-8 text-white/40 text-xs font-mono z-20">
            {String(current + 1).padStart(2, '0')}/{String(SLIDES.length).padStart(2, '0')}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
