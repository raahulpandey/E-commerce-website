'use client';

import { Suspense } from 'react';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { productService } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { ProductQuery } from '@/types';

const SORT_OPTIONS = [
  { label: 'Newest First', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Top Rated', value: 'rating_desc' },
];

function ShopContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showFilters, setShowFilters] = useState(false);

  const getQuery = useCallback((): ProductQuery => ({
    search: searchParams.get('search') || undefined,
    category: searchParams.get('category') || undefined,
    brand: searchParams.get('brand') || undefined,
    minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
    maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
    sortBy: (searchParams.get('sortBy') as ProductQuery['sortBy']) || 'newest',
    page: Number(searchParams.get('page')) || 1,
    limit: 12,
  }), [searchParams]);

  const query = getQuery();

  const { data, isLoading } = useQuery({
    queryKey: ['products', query],
    queryFn: () => productService.getAll(query),
  });

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
  });

  const updateParam = (key: string, value: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete('page'); // Reset page on filter change
    router.push(`/shop?${params}`);
  };

  const clearFilters = () => router.push('/shop');

  const hasActiveFilters = ['category', 'brand', 'minPrice', 'maxPrice', 'search'].some(
    (k) => searchParams.has(k)
  );

  const pagination = data?.pagination;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Shop' }]} />

      <div className="flex items-center justify-between mt-6 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">All Products</h1>
          {data && (
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
              {data.pagination.totalProducts.toLocaleString()} products found
            </p>
          )}
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<SlidersHorizontal className="h-4 w-4" />}
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden"
          >
            Filters
          </Button>

          {/* Sort */}
          <select
            value={query.sortBy || 'newest'}
            onChange={(e) => updateParam('sortBy', e.target.value)}
            className="text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar Filters */}
        <aside className={`w-64 shrink-0 space-y-6 ${showFilters ? 'block' : 'hidden'} lg:block`}>
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 dark:text-white">Filters</h3>
              {hasActiveFilters && (
                <button onClick={clearFilters} className="text-xs text-violet-600 hover:underline flex items-center gap-1">
                  <X className="h-3 w-3" /> Clear all
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Category</h4>
              <div className="space-y-2">
                {categories?.map((cat: any) => (
                  <button
                    key={cat._id}
                    onClick={() => updateParam('category', searchParams.get('category') === cat.slug ? null : cat.slug)}
                    className={`w-full text-left text-sm px-3 py-2 rounded-lg transition-colors ${
                      searchParams.get('category') === cat.slug
                        ? 'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="mb-5">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Price Range</h4>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="Min"
                  defaultValue={searchParams.get('minPrice') || ''}
                  onBlur={(e) => updateParam('minPrice', e.target.value || null)}
                  className="w-1/2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:border-violet-500"
                />
                <input
                  type="number"
                  placeholder="Max"
                  defaultValue={searchParams.get('maxPrice') || ''}
                  onBlur={(e) => updateParam('maxPrice', e.target.value || null)}
                  className="w-1/2 text-sm border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* In Stock Filter */}
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={searchParams.get('inStock') === 'true'}
                onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : null)}
                className="h-4 w-4 rounded border-slate-300 text-violet-600 focus:ring-violet-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-300">In Stock Only</span>
            </label>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {isLoading ? (
            <ProductGridSkeleton count={12} />
          ) : !data?.products?.length ? (
            <EmptyState type="products" />
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
                {data.products.map((product: any) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-10">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage === 1}
                    onClick={() => updateParam('page', String(pagination.currentPage - 1))}
                  >
                    Previous
                  </Button>
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <button
                        key={page}
                        onClick={() => updateParam('page', String(page))}
                        className={`h-9 w-9 rounded-xl text-sm font-semibold transition-all ${
                          pagination.currentPage === page
                            ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/30'
                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={pagination.currentPage === pagination.totalPages}
                    onClick={() => updateParam('page', String(pagination.currentPage + 1))}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8 flex justify-center"><div className="h-8 w-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <ShopContent />
    </Suspense>
  );
}
