'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShoppingCart, Heart, Star, Eye, Zap } from 'lucide-react';
import { toast } from 'sonner';
import type { Product } from '@/types';
import { formatPrice, getEffectivePrice, getDiscountPercentage, cn } from '@/utils';
import { ProductImage } from '@/components/ui/ProductImage';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority }: ProductCardProps) {
  const { addItem: addToCart, isLoading: cartLoading } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const [addingToCart, setAddingToCart] = useState(false);

  const effectivePrice = getEffectivePrice(product.price, product.discountedPrice);
  const discountPct = getDiscountPercentage(product.price, product.discountedPrice);
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock === 0;
  const categoryName = typeof product.category === 'object' ? (product.category as any).name : product.categoryName || '';

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please sign in to add items to cart'); return; }
    if (isOutOfStock || addingToCart) return;
    setAddingToCart(true);
    await addToCart(product._id);
    toast.success('Added to cart! 🛒');
    setAddingToCart(false);
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) { toast.error('Please sign in to use wishlist'); return; }
    if (isWishlisted) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product._id);
      toast.success('Saved to wishlist ♥');
    }
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.15 }}
      className="group relative bg-white dark:bg-slate-900 rounded-xl overflow-hidden border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:shadow-black/10 hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-300"
    >
      <Link href={`/products/${product._id}`}>
        {/* Image container */}
        <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-800">
          <ProductImage
            src={product.images?.[0]}
            alt={product.title}
            category={categoryName}
            aspectClass="aspect-[3/4]"
            objectFit="cover"
            className="group-hover:scale-105 transition-transform duration-500"
          />

          {/* Top badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {discountPct > 0 && (
              <span className="bg-[#FF3F6C] text-white text-[10px] font-black px-2 py-0.5 rounded tracking-wide">
                -{discountPct}%
              </span>
            )}
            {product.stock <= 5 && product.stock > 0 && (
              <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Only {product.stock} left
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-slate-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                Sold Out
              </span>
            )}
          </div>

          {/* Wishlist heart */}
          <button
            onClick={handleWishlist}
            className={cn(
              'absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 shadow-sm',
              isWishlisted
                ? 'bg-[#FF3F6C] text-white scale-110'
                : 'bg-white/90 text-slate-400 hover:bg-white hover:text-[#FF3F6C] opacity-0 group-hover:opacity-100'
            )}
          >
            <Heart className={cn('h-4 w-4', isWishlisted && 'fill-current')} />
          </button>

          {/* Quick add to cart — slides up on hover */}
          {!isOutOfStock && (
            <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <button
                onClick={handleAddToCart}
                disabled={addingToCart}
                className="w-full py-3 bg-slate-900 hover:bg-[#FF3F6C] text-white text-xs font-bold tracking-widest uppercase transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {addingToCart ? (
                  <span className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                ) : (
                  <ShoppingCart className="h-3.5 w-3.5" />
                )}
                {addingToCart ? 'Adding...' : 'Quick Add'}
              </button>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="p-3">
          {/* Brand */}
          {product.brand && (
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate mb-0.5">
              {product.brand}
            </p>
          )}

          {/* Title */}
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-2 leading-snug mb-2">
            {product.title}
          </p>

          {/* Rating */}
          {product.rating?.average > 0 && (
            <div className="flex items-center gap-1 mb-2">
              <div className="flex items-center gap-0.5 bg-green-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                <span>{product.rating.average.toFixed(1)}</span>
                <Star className="h-2.5 w-2.5 fill-current" />
              </div>
              <span className="text-[10px] text-slate-400">({product.rating.count?.toLocaleString('en-IN')})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-black text-slate-900 dark:text-white">
              {formatPrice(effectivePrice)}
            </span>
            {discountPct > 0 && (
              <>
                <span className="text-xs text-slate-400 line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs font-bold text-green-600">
                  {discountPct}% off
                </span>
              </>
            )}
          </div>

          {/* Free delivery tag */}
          {effectivePrice >= 499 && (
            <p className="text-[10px] text-green-600 font-medium mt-1">✓ Free Delivery</p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}
