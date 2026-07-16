'use client';

import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { formatPrice } from '@/utils';
import { Breadcrumb } from '@/components/ui/Breadcrumb';

export default function CartPage() {
  const { cart, updateItem, removeItem, clearCart, fetchCart, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <EmptyState type="cart" title="Sign in to view your cart" description="You need to be signed in to access your cart." actionLabel="Sign In" actionHref="/login" />
      </div>
    );
  }

  const items = cart?.items || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Cart' }]} />
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-6 mb-8">
        Shopping Cart
        {items.length > 0 && (
          <span className="ml-2 text-slate-400 font-normal text-xl">({items.length} items)</span>
        )}
      </h1>

      {items.length === 0 ? (
        <EmptyState type="cart" />
      ) : (
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.product._id} className="flex gap-5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
                <Link href={`/products/${item.product._id}`} className="shrink-0">
                  <div className="relative h-24 w-24 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    <Image src={item.product.images?.[0] || '/placeholder.jpg'} alt={item.product.title} fill className="object-cover" />
                  </div>
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product._id}`}>
                    <h3 className="font-semibold text-slate-900 dark:text-white hover:text-violet-600 transition-colors line-clamp-2">{item.product.title}</h3>
                  </Link>
                  <p className="text-violet-600 dark:text-violet-400 font-bold mt-1">{formatPrice(item.price)}</p>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                      <button onClick={() => item.quantity > 1 ? updateItem(item.product._id, item.quantity - 1) : removeItem(item.product._id)} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors">
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-7 text-center font-bold text-sm">{item.quantity}</span>
                      <button onClick={() => updateItem(item.product._id, item.quantity + 1)} disabled={item.quantity >= item.product.stock} className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors disabled:opacity-40">
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <p className="font-bold text-slate-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
                      <button onClick={() => removeItem(item.product._id)} className="text-slate-400 hover:text-red-500 transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={() => clearCart()} className="text-sm text-red-500 hover:text-red-600 hover:underline">
              Clear all items
            </button>
          </div>

          {/* Order Summary */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 h-fit space-y-4">
            <h2 className="font-bold text-slate-900 dark:text-white text-lg">Order Summary</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal ({cart?.totalItems} items)</span>
                <span>{formatPrice(cart?.totalPrice || 0)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Shipping</span>
                <span className="text-green-600">Free</span>
              </div>
              <hr className="border-slate-100 dark:border-slate-800" />
              <div className="flex justify-between font-bold text-slate-900 dark:text-white text-base">
                <span>Total</span>
                <span>{formatPrice(cart?.totalPrice || 0)}</span>
              </div>
            </div>
            <Link href="/checkout">
              <Button fullWidth size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                Proceed to Checkout
              </Button>
            </Link>
            <Link href="/shop" className="block">
              <Button fullWidth variant="outline" leftIcon={<ShoppingBag className="h-4 w-4" />}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
