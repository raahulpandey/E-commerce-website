'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    tag: 'END OF SEASON SALE',
    headline: 'UP TO 70% OFF',
    sub: 'On Fashion, Electronics & More',
    cta: 'SHOP NOW',
    href: '/shop',
    bg: 'from-[#1a0533] via-[#3d0868] to-[#6a0dad]',
    accent: '#FF3F6C',
    textColor: 'text-white',
    image: 'https://cdn.dummyjson.com/products/images/womens-dresses/Black%20Women%20Coat/1.webp',
    badge: '🔥 Trending',
  },
  {
    id: 2,
    tag: 'NEW ARRIVALS',
    headline: 'SUMMER COLLECTION',
    sub: 'Fresh styles for the season',
    cta: 'EXPLORE',
    href: '/shop?category=womens-dresses',
    bg: 'from-[#0f2027] via-[#203a43] to-[#2c5364]',
    accent: '#00D4FF',
    textColor: 'text-white',
    image: 'https://cdn.dummyjson.com/products/images/tops/Blouse/1.webp',
    badge: '✨ New',
  },
  {
    id: 3,
    tag: 'ELECTRONICS FEST',
    headline: 'BEST DEALS ON TECH',
    sub: 'Smartphones, Laptops & more',
    cta: 'GRAB DEAL',
    href: '/shop?category=smartphones',
    bg: 'from-[#0a0a0a] via-[#1a1a2e] to-[#16213e]',
    accent: '#FFD700',
    textColor: 'text-white',
    image: 'https://cdn.dummyjson.com/products/images/smartphones/iPhone%2015/1.webp',
    badge: '⚡ Flash Sale',
  },
  {
    id: 4,
    tag: 'BEAUTY ESSENTIALS',
    headline: 'GLOW UP THIS SEASON',
    sub: 'Top skincare & makeup brands',
    cta: 'SHOP BEAUTY',
    href: '/shop?category=beauty',
    bg: 'from-[#2d1b69] via-[#11998e] to-[#38ef7d]',
    accent: '#FF69B4',
    textColor: 'text-white',
    image: 'https://cdn.dummyjson.com/products/images/beauty/Eyeshadow%20Palette%20with%20Mirror/1.webp',
    badge: '💄 Beauty',
  },
];

export function HeroBannerMyntra() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent(prev => (prev + 1) % SLIDES.length);
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (idx: number) => {
    setCurrent(idx);
    startTimer();
  };

  const prev = () => goTo((current - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((current + 1) % SLIDES.length);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full h-[92vh] min-h-[580px] max-h-[820px] overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.7, ease: 'easeInOut' }}
          className={`absolute inset-0 bg-gradient-to-br ${slide.bg}`}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)' }}
          />

          <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-12 h-full flex items-center">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center w-full">

              {/* Left: Text content */}
              <motion.div
                initial={{ x: -60, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-6"
              >
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold bg-white/15 backdrop-blur-sm text-white border border-white/20">
                  {slide.badge}
                </div>

                {/* Tag */}
                <p className="text-sm font-bold tracking-[0.3em] uppercase"
                  style={{ color: slide.accent }}>
                  {slide.tag}
                </p>

                {/* Headline */}
                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-none tracking-tight">
                  {slide.headline}
                </h1>

                {/* Sub */}
                <p className="text-xl text-white/70 font-medium">{slide.sub}</p>

                {/* CTA */}
                <div className="flex gap-4 pt-2">
                  <Link href={slide.href}
                    className="group inline-flex items-center gap-2 px-8 py-4 text-sm font-extrabold tracking-widest rounded-full text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                    style={{ backgroundColor: slide.accent, boxShadow: `0 0 30px ${slide.accent}60` }}
                  >
                    {slide.cta}
                    <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link href="/categories"
                    className="inline-flex items-center px-8 py-4 text-sm font-bold tracking-widest rounded-full border-2 border-white/30 text-white hover:bg-white/10 transition-all duration-300"
                  >
                    VIEW ALL
                  </Link>
                </div>

                {/* Slide indicators */}
                <div className="flex gap-2 pt-4">
                  {SLIDES.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i)}
                      className={`transition-all duration-300 rounded-full ${i === current ? 'w-8 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`}
                    />
                  ))}
                </div>
              </motion.div>

              {/* Right: Product image */}
              <motion.div
                initial={{ x: 60, opacity: 0, rotate: 3 }}
                animate={{ x: 0, opacity: 1, rotate: 0 }}
                transition={{ delay: 0.3, duration: 0.7 }}
                className="hidden lg:flex justify-center items-end h-[70vh] relative"
              >
                {!imgErrors[slide.id] ? (
                  <div className="relative h-full w-72 xl:w-96">
                    <div className="absolute inset-0 rounded-3xl"
                      style={{ background: `radial-gradient(ellipse at center, ${slide.accent}30 0%, transparent 70%)` }}
                    />
                    <Image
                      src={slide.image}
                      alt={slide.headline}
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                      onError={() => setImgErrors(p => ({ ...p, [slide.id]: true }))}
                    />
                  </div>
                ) : (
                  <div className="w-72 h-96 rounded-3xl bg-white/5 flex items-center justify-center">
                    <span className="text-6xl">{slide.badge?.split(' ')[0]}</span>
                  </div>
                )}

                {/* Floating price tag */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute top-16 -left-6 bg-white rounded-2xl px-4 py-2 shadow-2xl"
                >
                  <p className="text-xs text-slate-500 font-medium">Starting from</p>
                  <p className="text-lg font-black" style={{ color: slide.accent }}>₹299</p>
                </motion.div>

                {/* Floating offer badge */}
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, delay: 0.5 }}
                  className="absolute bottom-24 -right-4 text-white rounded-2xl px-4 py-2 shadow-2xl font-bold text-sm"
                  style={{ backgroundColor: slide.accent }}
                >
                  UPTO 70% OFF
                </motion.div>
              </motion.div>
            </div>
          </div>

          {/* Prev/Next arrows */}
          <button onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white/10 hover:bg-white/25 backdrop-blur-sm border border-white/20 rounded-full flex items-center justify-center text-white transition-all hover:scale-110">
            <ChevronRight className="h-5 w-5" />
          </button>

          {/* Slide counter */}
          <div className="absolute bottom-6 right-8 text-white/50 text-sm font-mono">
            {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
