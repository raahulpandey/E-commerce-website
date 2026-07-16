'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import { productService } from '@/services/product.service';
import { ProductCard } from '@/components/product/ProductCard';
import { ProductGridSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/common/EmptyState';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['search', q],
    queryFn: () => productService.getAll({ search: q, limit: 20 }),
    enabled: !!q,
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Search' }]} />

      <div className="mt-6 mb-8">
        <div className="flex items-center gap-3">
          <Search className="h-7 w-7 text-violet-600" />
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {q ? `Results for "${q}"` : 'Search Products'}
            </h1>
            {data && (
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                {data.pagination?.totalProducts || 0} products found
              </p>
            )}
          </div>
        </div>
      </div>

      {!q ? (
        <EmptyState type="search" title="Start searching" description="Enter a search term in the navbar to find products." actionLabel="Browse All Products" actionHref="/shop" />
      ) : isLoading ? (
        <ProductGridSkeleton count={8} />
      ) : !data?.products?.length ? (
        <EmptyState type="search" description={`No results found for "${q}". Try a different search term.`} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {data.products.map((p: any) => <ProductCard key={p._id} product={p} />)}
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-8"><ProductGridSkeleton count={8} /></div>}>
      <SearchContent />
    </Suspense>
  );
}
