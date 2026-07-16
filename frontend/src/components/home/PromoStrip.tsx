'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export function PromoStrip() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="my-12 rounded-3xl overflow-hidden relative bg-gradient-to-r from-violet-600 via-indigo-600 to-purple-700 p-10 text-center text-white"
    >
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
      <div className="relative">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 text-sm font-semibold mb-4">
          <Zap className="h-4 w-4 fill-current text-yellow-300" />
          Limited Time Deal
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Get 20% Off Your First Order
        </h2>
        <p className="text-slate-200 mb-8 max-w-md mx-auto">
          Use code <strong>WELCOME20</strong> at checkout. New customers only. Valid for 7 days.
        </p>
        <Link href="/shop">
          <Button className="bg-white text-slate-900 hover:bg-slate-100 shadow-2xl shadow-white/30">
            Shop Now — Use WELCOME20
          </Button>
        </Link>
      </div>
    </motion.section>
  );
}
