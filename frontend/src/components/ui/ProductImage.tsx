'use client';

import { useState } from 'react';

/**
 * Smart product image component that:
 * - Uses native <img> to avoid Next.js optimizer double-encoding DummyJSON URLs
 * - Shows elegant skeleton while loading
 * - Falls back to category-based gradient with emoji on error
 */

const CATEGORY_FALLBACKS: Record<string, { emoji: string; color: string }> = {
  smartphone: { emoji: '📱', color: '#1d1d1f' },
  laptop: { emoji: '💻', color: '#1d1d1f' },
  tablet: { emoji: '📟', color: '#1d1d1f' },
  mobile: { emoji: '🎧', color: '#6366f1' },
  beauty: { emoji: '💄', color: '#db2777' },
  fragrance: { emoji: '🌸', color: '#9333ea' },
  furniture: { emoji: '🛋️', color: '#92400e' },
  grocery: { emoji: '🥑', color: '#16a34a' },
  'home-decoration': { emoji: '🏠', color: '#7c3aed' },
  kitchen: { emoji: '🍳', color: '#ea580c' },
  shirt: { emoji: '👕', color: '#2563eb' },
  shoe: { emoji: '👟', color: '#d97706' },
  watch: { emoji: '⌚', color: '#374151' },
  bag: { emoji: '👜', color: '#be185d' },
  dress: { emoji: '👗', color: '#db2777' },
  jewellery: { emoji: '💎', color: '#7c3aed' },
  sunglasses: { emoji: '🕶️', color: '#1f2937' },
  sport: { emoji: '⚽', color: '#16a34a' },
  skin: { emoji: '🧴', color: '#0d9488' },
  top: { emoji: '👚', color: '#ec4899' },
};

function getFallback(title?: string, category?: string) {
  const text = `${title || ''} ${category || ''}`.toLowerCase();
  for (const [key, val] of Object.entries(CATEGORY_FALLBACKS)) {
    if (text.includes(key)) return val;
  }
  return { emoji: '🛍️', color: '#6366f1' };
}

interface ProductImageProps {
  src?: string;
  alt: string;
  category?: string;
  className?: string;
  aspectClass?: string; // e.g. "aspect-square" or "aspect-[3/4]"
  objectFit?: 'cover' | 'contain';
}

export function ProductImage({
  src,
  alt,
  category,
  className = '',
  aspectClass = 'aspect-square',
  objectFit = 'cover',
}: ProductImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const fallback = getFallback(alt, category);

  if (errored || !src) {
    return (
      <div className={`${aspectClass} w-full flex flex-col items-center justify-center rounded-inherit`}
        style={{ background: `linear-gradient(135deg, ${fallback.color}22, ${fallback.color}44)` }}>
        <span className="text-5xl select-none">{fallback.emoji}</span>
        <span className="text-xs text-slate-400 mt-2 text-center px-2 line-clamp-1">{alt}</span>
      </div>
    );
  }

  return (
    <div className={`relative ${aspectClass} w-full overflow-hidden ${className}`}>
      {/* Skeleton shimmer */}
      {!loaded && (
        <div className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setErrored(true)}
        className={`w-full h-full transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        style={{ objectFit }}
      />
    </div>
  );
}
