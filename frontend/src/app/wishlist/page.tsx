'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, ArrowRight, Trash2 } from 'lucide-react';
import { wishlistService } from '@/services/cart.service';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { ProductCard } from '@/components/product/ProductCard';
import { EmptyState } from '@/components/common/EmptyState';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const { wishlist, isLoading, fetchWishlist } = useWishlistStore();

  const { data, isLoading: loading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: wishlistService.get,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState type="wishlist" title="Sign in to view your wishlist" actionLabel="Sign In" actionHref="/login" />
      </div>
    );
  }

  const products = data?.products || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Wishlist' }]} />
      <div className="flex items-center justify-between mt-6 mb-8">
        <div className="flex items-center gap-3">
          <Heart className="h-7 w-7 text-red-500 fill-red-500" />
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            My Wishlist
            {products.length > 0 && (
              <span className="ml-2 text-slate-400 font-normal text-xl">({products.length})</span>
            )}
          </h1>
        </div>
        {products.length > 0 && (
          <Link href="/shop" className="text-sm font-semibold text-violet-600 dark:text-violet-400 flex items-center gap-1 hover:underline">
            Continue Shopping <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : products.length === 0 ? (
        <EmptyState type="wishlist" />
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.07 } }, hidden: {} }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {products.map(({ product }: any, i: number) => (
            <motion.div
              key={product._id}
              variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
