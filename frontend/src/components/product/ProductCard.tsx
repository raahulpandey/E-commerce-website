'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import type { Product } from '@/types';
import { formatPrice, getEffectivePrice, getDiscountPercentage, cn } from '@/utils';
import { getImageFallback } from '@/utils/imageUtils';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { Badge } from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem: addToCart, isLoading: cartLoading } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [imgSrc, setImgSrc] = useState<string>(
    product.images?.[0] || getImageFallback()
  );
  const [imgError, setImgError] = useState(false);

  const effectivePrice = getEffectivePrice(product.price, product.discountedPrice);
  const discountPct = getDiscountPercentage(product.price, product.discountedPrice);
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to add items to cart');
      return;
    }
    if (isOutOfStock) return;
    await addToCart(product._id);
    toast.success('Added to cart!');
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error('Please sign in to use wishlist');
      return;
    }
    if (isWishlisted) {
      await removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      await addToWishlist(product._id);
      toast.success('Added to wishlist!');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:shadow-violet-500/10 transition-shadow duration-300"
    >
      <Link href={`/products/${product._id}`}>
        {/* Image */}
        <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-800 aspect-square">
          {imgError ? (
            // Instant SVG fallback — no external request, no broken icon
            <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-slate-800">
              <div className="text-center text-slate-400">
                <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-xs">{product.title.slice(0, 20)}</p>
              </div>
            </div>
          ) : (
            <Image
              src={imgSrc}
              alt={product.title}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
              onError={() => setImgError(true)}
            />
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
            {discountPct > 0 && (
              <Badge variant="danger" className="text-xs font-bold">
                -{discountPct}%
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="default" className="text-xs">
                Out of Stock
              </Badge>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <Badge variant="warning" className="text-xs">
                Only {product.stock} left
              </Badge>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlistToggle}
            className={cn(
              'absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-200',
              'opacity-0 group-hover:opacity-100',
              isWishlisted
                ? 'bg-red-500 text-white'
                : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-red-50 hover:text-red-500'
            )}
            aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
          </button>

          {/* Quick View overlay */}
          <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-3">
            <span className="text-white text-xs font-medium flex items-center gap-1">
              <Eye className="h-3.5 w-3.5" /> Quick View
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Brand */}
          {product.brand && (
            <p className="text-xs text-violet-500 dark:text-violet-400 font-semibold uppercase tracking-wider mb-1">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <h3 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-2 mb-2 leading-snug">
            {product.title}
          </h3>

          {/* Rating */}
          {product.rating.count > 0 && (
            <div className="flex items-center gap-1.5 mb-2">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={cn(
                      'h-3 w-3',
                      s <= product.rating.average
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-200 dark:text-slate-700'
                    )}
                  />
                ))}
              </div>
              <span className="text-xs text-slate-500">({product.rating.count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 mb-3">
            <span className="text-base font-bold text-slate-900 dark:text-white">
              {formatPrice(effectivePrice)}
            </span>
            {discountPct > 0 && (
              <span className="text-xs text-slate-400 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Add to Cart */}
      <div className="px-4 pb-4">
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock || cartLoading}
          className={cn(
            'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200',
            isOutOfStock
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
              : 'bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40'
          )}
        >
          <ShoppingCart className="h-4 w-4" />
          {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
}
