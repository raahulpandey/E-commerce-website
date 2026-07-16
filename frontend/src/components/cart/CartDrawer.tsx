'use client';

import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/common/EmptyState';
import { formatPrice } from '@/utils';

export function CartDrawer() {
  const { cart, isOpen, closeCart, updateItem, removeItem, isLoading } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full sm:w-[420px] bg-white dark:bg-slate-900 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <ShoppingBag className="h-5 w-5 text-violet-600" />
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  Your Cart
                  {cart && cart.totalItems > 0 && (
                    <span className="ml-2 text-sm font-normal text-slate-500">
                      ({cart.totalItems} {cart.totalItems === 1 ? 'item' : 'items'})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-5">
              {!isAuthenticated ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="h-12 w-12 text-violet-400 mb-4" />
                  <p className="text-slate-600 dark:text-slate-400 mb-4">Sign in to view your cart</p>
                  <Link href="/login" onClick={closeCart}>
                    <Button>Sign In</Button>
                  </Link>
                </div>
              ) : !cart || cart.items.length === 0 ? (
                <div className="h-full flex items-center justify-center">
                  <EmptyState type="cart" />
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.items.map((item) => (
                    <motion.div
                      key={item.product._id}
                      layout
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl"
                    >
                      {/* Image */}
                      <Link
                        href={`/products/${item.product._id}`}
                        onClick={closeCart}
                        className="shrink-0"
                      >
                        <div className="relative h-16 w-16 rounded-xl overflow-hidden bg-white dark:bg-slate-700">
                          <Image
                            src={item.product.images?.[0] || '/placeholder.jpg'}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </Link>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${item.product._id}`} onClick={closeCart}>
                          <h4 className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1 hover:text-violet-600 transition-colors">
                            {item.product.title}
                          </h4>
                        </Link>
                        <p className="text-sm font-bold text-violet-600 dark:text-violet-400 mt-0.5">
                          {formatPrice(item.price)}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                item.quantity > 1
                                  ? updateItem(item.product._id, item.quantity - 1)
                                  : removeItem(item.product._id)
                              }
                              className="h-7 w-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:border-violet-400 transition-colors"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateItem(item.product._id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="h-7 w-7 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center hover:border-violet-400 transition-colors disabled:opacity-40"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          <button
                            onClick={() => removeItem(item.product._id)}
                            className="text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with total + checkout */}
            {isAuthenticated && cart && cart.items.length > 0 && (
              <div className="p-5 border-t border-slate-100 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Subtotal</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
                    {formatPrice(cart.totalPrice)}
                  </span>
                </div>
                <p className="text-xs text-slate-500 text-center">Taxes and shipping calculated at checkout</p>
                <Link href="/checkout" onClick={closeCart}>
                  <Button fullWidth size="lg" rightIcon={<ArrowRight className="h-5 w-5" />}>
                    Checkout · {formatPrice(cart.totalPrice)}
                  </Button>
                </Link>
                <Link href="/cart" onClick={closeCart}>
                  <Button fullWidth variant="outline">
                    View Cart
                  </Button>
                </Link>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
