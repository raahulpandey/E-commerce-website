'use client';

import { PackageX, ShoppingBag, Heart, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface EmptyStateProps {
  type?: 'cart' | 'wishlist' | 'orders' | 'search' | 'products' | 'generic';
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

const configs = {
  cart: {
    Icon: ShoppingBag,
    title: 'Your cart is empty',
    description: 'Looks like you haven\'t added anything yet.',
    actionLabel: 'Start Shopping',
    actionHref: '/shop',
  },
  wishlist: {
    Icon: Heart,
    title: 'Your wishlist is empty',
    description: 'Save items you love and come back to them anytime.',
    actionLabel: 'Browse Products',
    actionHref: '/shop',
  },
  orders: {
    Icon: PackageX,
    title: 'No orders yet',
    description: 'You haven\'t placed any orders. Start shopping!',
    actionLabel: 'Shop Now',
    actionHref: '/shop',
  },
  search: {
    Icon: Search,
    title: 'No results found',
    description: 'Try a different search term or browse our categories.',
    actionLabel: 'Browse All',
    actionHref: '/shop',
  },
  products: {
    Icon: PackageX,
    title: 'No products found',
    description: 'Try adjusting your filters or search terms.',
    actionLabel: 'Clear Filters',
    actionHref: '/shop',
  },
  generic: {
    Icon: AlertCircle,
    title: 'Nothing here',
    description: 'There\'s nothing to show right now.',
    actionLabel: 'Go Home',
    actionHref: '/',
  },
};

export function EmptyState({
  type = 'generic',
  title,
  description,
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  const config = configs[type];
  const { Icon } = config;

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center px-4">
      <div className="mb-6 p-6 rounded-full bg-violet-50 dark:bg-violet-900/20">
        <Icon className="h-12 w-12 text-violet-400 dark:text-violet-500" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
        {title || config.title}
      </h2>
      <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-sm">
        {description || config.description}
      </p>
      <Link href={actionHref || config.actionHref}>
        <Button variant="primary">{actionLabel || config.actionLabel}</Button>
      </Link>
    </div>
  );
}
