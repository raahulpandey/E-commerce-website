'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Package, MapPin, CreditCard, AlertCircle } from 'lucide-react';
import { orderService } from '@/services/order.service';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice, formatDateTime, getStatusColor } from '@/utils';
import { toast } from 'sonner';
import type { Order } from '@/types';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();

  const { data: order, isLoading, refetch } = useQuery<Order>({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id),
  });

  const handleCancel = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await orderService.cancel(id, 'Customer requested cancellation');
      refetch();
      toast.success('Order cancelled successfully');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Cannot cancel this order');
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-48 rounded-2xl" />
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!order) return null;

  const currentStep = STATUS_STEPS.indexOf(order.status);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Orders', href: '/orders' }, { label: `#${order._id.slice(-8).toUpperCase()}` }]} />

      <div className="flex items-center justify-between mt-6 mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Order #{order._id.slice(-8).toUpperCase()}
        </h1>
        <Badge className={`${getStatusColor(order.status)} text-sm px-3 py-1`}>{order.status}</Badge>
      </div>

      {/* Progress Tracker */}
      {order.status !== 'cancelled' && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 mb-6">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-4 h-0.5 bg-slate-100 dark:bg-slate-800" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-700"
              style={{ width: `${currentStep === -1 ? 0 : (currentStep / (STATUS_STEPS.length - 1)) * 100}%` }}
            />
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs border-2 transition-all ${
                  i <= currentStep
                    ? 'bg-violet-600 border-violet-600 text-white'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                }`}>
                  {i + 1}
                </div>
                <span className="text-xs font-medium capitalize text-slate-600 dark:text-slate-400">{step}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Items */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 mb-6">
        <h2 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Package className="h-5 w-5 text-violet-600" /> Order Items
        </h2>
        <div className="space-y-4">
          {order.items.map((item, i) => (
            <div key={i} className="flex items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800 last:border-0 last:pb-0">
              <div className="h-16 w-16 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 overflow-hidden relative">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                ) : (
                  <Package className="h-6 w-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-900 dark:text-white text-sm line-clamp-2">{item.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <p className="font-bold text-slate-900 dark:text-white">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between font-bold text-slate-900 dark:text-white text-lg">
          <span>Total</span>
          <span>{formatPrice(order.totalAmount)}</span>
        </div>
      </div>

      {/* Shipping + Payment */}
      <div className="grid sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-violet-600" /> Shipping Address
          </h3>
          <address className="not-italic text-sm text-slate-600 dark:text-slate-400 space-y-1">
            <p className="font-semibold text-slate-800 dark:text-slate-200">{order.shippingAddress.fullName}</p>
            <p>{order.shippingAddress.street}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && <p>{order.shippingAddress.phone}</p>}
          </address>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2 text-sm">
            <CreditCard className="h-4 w-4 text-violet-600" /> Payment
          </h3>
          <div className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex justify-between">
              <span>Method</span>
              <span className="font-semibold uppercase text-slate-800 dark:text-slate-200">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span>Status</span>
              <Badge variant={order.isPaid ? 'success' : 'warning'}>{order.isPaid ? 'Paid' : 'Pending'}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Ordered</span>
              <span>{formatDateTime(order.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Button */}
      {['pending', 'processing'].includes(order.status) && (
        <div className="flex justify-end">
          <Button variant="danger" leftIcon={<AlertCircle className="h-4 w-4" />} onClick={handleCancel}>
            Cancel Order
          </Button>
        </div>
      )}
    </div>
  );
}
