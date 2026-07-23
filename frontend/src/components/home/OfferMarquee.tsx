'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

const OFFERS = [
  { emoji: '🚚', text: 'FREE DELIVERY on orders above ₹499' },
  { emoji: '↩️', text: '30-DAY easy returns' },
  { emoji: '🔒', text: '100% SECURE payments' },
  { emoji: '⚡', text: 'FLASH SALE — Ends midnight!' },
  { emoji: '🎁', text: 'BUY 2 GET 1 FREE on selected items' },
  { emoji: '📱', text: 'EXTRA 10% OFF on App orders' },
  { emoji: '💳', text: 'NO COST EMI on orders above ₹2,999' },
  { emoji: '🌟', text: 'NEW ARRIVALS every Monday' },
];

export function OfferMarquee() {
  return (
    <div className="bg-gradient-to-r from-[#FF3F6C] via-[#d4145a] to-[#FF3F6C] text-white py-2.5 overflow-hidden">
      <div className="flex gap-0">
        {/* Two identical copies for seamless loop */}
        {[0, 1].map(copy => (
          <motion.div
            key={copy}
            animate={{ x: [0, '-100%'] }}
            transition={{ duration: 30, ease: 'linear', repeat: Infinity }}
            className="flex gap-0 shrink-0"
          >
            {OFFERS.map((o, i) => (
              <div key={i} className="flex items-center gap-6 px-8 whitespace-nowrap">
                <span className="text-sm font-bold tracking-wide">
                  {o.emoji} {o.text}
                </span>
                <span className="text-white/40">•</span>
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
