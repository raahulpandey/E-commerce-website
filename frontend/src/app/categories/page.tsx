'use client';

import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { categoryService } from '@/services/product.service';
import { Skeleton } from '@/components/ui/Skeleton';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

const COLORS = [
  'from-violet-500 to-indigo-600',
  'from-rose-500 to-pink-600',
  'from-amber-500 to-orange-600',
  'from-teal-500 to-cyan-600',
  'from-emerald-500 to-green-600',
  'from-blue-500 to-indigo-500',
  'from-purple-500 to-violet-600',
  'from-red-500 to-rose-600',
];

export default function CategoriesPage() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: categoryService.getAll,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Categories' }]} />
      <div className="mt-6 mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">All Categories</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-2">Browse products by category</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-48" rounded="lg" />)}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{ visible: { transition: { staggerChildren: 0.06 } }, hidden: {} }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {categories?.map((cat: any, i: number) => (
            <motion.div
              key={cat._id}
              variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1 } }}
              whileHover={{ scale: 1.03 }}
            >
              <Link
                href={`/shop?category=${cat.slug}`}
                className={`group flex flex-col items-center justify-center rounded-3xl bg-gradient-to-br ${COLORS[i % COLORS.length]} p-8 text-center text-white min-h-[180px] hover:shadow-2xl transition-all`}
              >
                {cat.image ? (
                  <div className="relative h-16 w-16 mb-4">
                    <Image src={cat.image} alt={cat.name} fill className="object-contain drop-shadow-xl" />
                  </div>
                ) : (
                  <div className="text-5xl mb-4">{cat.icon || '🛍️'}</div>
                )}
                <h2 className="text-lg font-extrabold mb-1">{cat.name}</h2>
                {cat.description && (
                  <p className="text-white/70 text-xs mt-1 line-clamp-2">{cat.description}</p>
                )}
                <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-white/80 group-hover:text-white transition-colors">
                  Shop now <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
