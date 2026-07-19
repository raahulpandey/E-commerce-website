'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
        className="text-center max-w-md w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle2 className="h-14 w-14 text-green-500" />
            </div>
            <motion.div
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              className="absolute inset-0 rounded-full border-4 border-green-300 dark:border-green-700 opacity-50"
            />
          </div>
        </motion.div>

        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">
          Order Placed! 🎉
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-2">
          Thank you for your purchase. Your order has been confirmed and will be delivered soon.
        </p>

        {orderId && (
          <div className="mt-4 mb-6 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-2xl border border-violet-100 dark:border-violet-800">
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Order ID</p>
            <p className="font-mono text-sm font-bold text-violet-700 dark:text-violet-300 break-all">
              {orderId}
            </p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {orderId && (
            <Link href={`/orders/${orderId}`}>
              <Button leftIcon={<Package className="h-4 w-4" />}>Track Order</Button>
            </Link>
          )}
          <Link href="/">
            <Button variant="outline" leftIcon={<Home className="h-4 w-4" />}>Back to Home</Button>
          </Link>
        </div>

        <Link href="/shop" className="inline-flex items-center gap-1.5 mt-6 text-sm text-violet-600 dark:text-violet-400 hover:underline font-semibold">
          Continue Shopping <ArrowRight className="h-4 w-4" />
        </Link>
      </motion.div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-[calc(100vh-4rem)] flex items-center justify-center"><div className="h-8 w-8 border-4 border-violet-600 border-t-transparent rounded-full animate-spin" /></div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
