'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { productService } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';

export function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getAll({ sortBy: 'rating_desc', limit: 8 }),
  });

  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Top Picks
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Featured Products
          </h2>
        </div>
        <Link
          href="/shop"
          className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300 transition-colors"
        >
          View All <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={{
            visible: { transition: { staggerChildren: 0.07 } },
            hidden: {},
          }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6"
        >
          {data?.products?.map((product: any) => (
            <motion.div
              key={product._id}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <div className="mt-8 text-center sm:hidden">
        <Link href="/shop" className="text-sm font-semibold text-violet-600 dark:text-violet-400 flex items-center justify-center gap-1">
          View All Products <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
