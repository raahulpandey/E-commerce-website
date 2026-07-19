'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { categoryService } from '@/services/product.service';
import { Skeleton } from '@/components/ui/Skeleton';

const DEFAULT_COLORS = [
  'from-violet-500 to-indigo-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-cyan-600',
  'from-emerald-500 to-green-600',
  'from-blue-500 to-indigo-500',
];

export function CategoryGrid() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  return (
    <section className="py-16">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-violet-600 dark:text-violet-400 text-sm font-semibold uppercase tracking-wider mb-2">
            Explore
          </p>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Shop by Category
          </h2>
        </div>
        <Link href="/categories" className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-violet-600 dark:text-violet-400 hover:text-violet-700 transition-colors">
          All Categories <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-32" rounded="lg" />
          ))}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{ visible: { transition: { staggerChildren: 0.08 } }, hidden: {} }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {categories?.slice(0, 6).map((cat: any, i: number) => (
            <motion.div
              key={cat._id}
              variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className={`group block rounded-2xl bg-gradient-to-br ${DEFAULT_COLORS[i % DEFAULT_COLORS.length]} p-5 text-center text-white hover:scale-105 hover:shadow-xl transition-all duration-300`}
              >
                {cat.image ? (
                  <div className="relative h-12 w-12 mx-auto mb-3">
                    <Image src={cat.image} alt={cat.name} fill className="object-contain" />
                  </div>
                ) : (
                  <div className="text-3xl mb-3">{cat.icon || '🛍️'}</div>
                )}
                <p className="font-bold text-sm">{cat.name}</p>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </section>
  );
}
