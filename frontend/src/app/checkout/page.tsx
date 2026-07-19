'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { MapPin, Tag, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderService, couponService } from '@/services/order.service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { formatPrice } from '@/utils';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import type { CouponValidationResult } from '@/types';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  phone: z.string().min(10, 'Valid phone number required'),
  street: z.string().min(5, 'Street address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(4, 'Zip code is required'),
  country: z.string().min(2, 'Country is required'),
});

type AddressData = z.infer<typeof addressSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'online'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [couponResult, setCouponResult] = useState<CouponValidationResult | null>(null);
  const [isPlacing, setIsPlacing] = useState(false);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
  });

  const subtotal = cart?.totalPrice || 0;
  const discount = couponResult?.discount || 0;
  const total = Math.max(0, subtotal - discount);

  const handleCouponValidate = async () => {
    if (!couponCode.trim()) return;
    setIsValidatingCoupon(true);
    try {
      const result = await couponService.validate(couponCode, subtotal);
      setCouponResult(result);
      toast.success(`Coupon applied! You save ${formatPrice(result.discount)}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid coupon');
      setCouponResult(null);
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const onSubmit = async (address: AddressData) => {
    if (!cart || cart.items.length === 0) { toast.error('Your cart is empty'); return; }
    setIsPlacing(true);
    try {
      const order = await orderService.create({
        shippingAddress: { ...address },
        paymentMethod,
        couponCode: couponResult?.code,
      });
      await clearCart();
      router.push(`/order-success?orderId=${order._id}`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setIsPlacing(false);
    }
  };

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
      <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mt-6 mb-8">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping & Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
              <div className="flex items-center gap-2 mb-5">
                <MapPin className="h-5 w-5 text-violet-600" />
                <h2 className="font-bold text-slate-900 dark:text-white">Shipping Address</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input id="fullName" label="Full Name *" placeholder="John Doe" error={errors.fullName?.message} {...register('fullName')} />
                <Input id="phone" label="Phone *" placeholder="+91-9876543210" error={errors.phone?.message} {...register('phone')} />
                <Input id="street" label="Street Address *" placeholder="123 Main St" error={errors.street?.message} className="sm:col-span-2" {...register('street')} />
                <Input id="city" label="City *" placeholder="Mumbai" error={errors.city?.message} {...register('city')} />
                <Input id="state" label="State *" placeholder="Maharashtra" error={errors.state?.message} {...register('state')} />
                <Input id="zipCode" label="ZIP Code *" placeholder="400001" error={errors.zipCode?.message} {...register('zipCode')} />
                <Input id="country" label="Country *" placeholder="India" error={errors.country?.message} {...register('country')} />
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Payment Method</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {([
                  { value: 'cod', label: 'Cash on Delivery', desc: 'Pay when delivered' },
                  { value: 'online', label: 'Online Payment', desc: 'Coming soon' },
                ] as const).map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    disabled={opt.value === 'online'}
                    onClick={() => setPaymentMethod(opt.value)}
                    className={`p-4 rounded-xl border-2 text-left transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                      paymentMethod === opt.value
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/20'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{opt.label}</p>
                    <p className="text-xs text-slate-500">{opt.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
              <h2 className="font-bold text-slate-900 dark:text-white mb-4">Order Summary</h2>
              <div className="space-y-3 text-sm">
                {cart?.items.map((item) => (
                  <div key={item.product._id} className="flex justify-between text-slate-600 dark:text-slate-400">
                    <span className="line-clamp-1">{item.product.title} × {item.quantity}</span>
                    <span className="ml-2 shrink-0">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
                <hr className="border-slate-100 dark:border-slate-800" />
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Subtotal</span><span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 dark:text-green-400 font-medium">
                    <span>Discount ({couponResult?.code})</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>Shipping</span><span className="text-green-600">Free</span>
                </div>
                <hr className="border-slate-100 dark:border-slate-800" />
                <div className="flex justify-between font-bold text-slate-900 dark:text-white text-base">
                  <span>Total</span><span>{formatPrice(total)}</span>
                </div>
              </div>
            </div>

            {/* Coupon */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4">
              <div className="flex items-center gap-2 mb-3">
                <Tag className="h-4 w-4 text-violet-600" />
                <p className="font-semibold text-slate-900 dark:text-white text-sm">Have a coupon?</p>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  className="flex-1 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm dark:text-white focus:outline-none focus:border-violet-500"
                />
                <Button type="button" size="sm" variant="outline" onClick={handleCouponValidate} isLoading={isValidatingCoupon}>
                  Apply
                </Button>
              </div>
              {couponResult && (
                <p className="text-green-600 text-xs mt-1.5">✓ {couponResult.code} applied — {formatPrice(discount)} off</p>
              )}
            </div>

            <Button type="submit" fullWidth size="lg" isLoading={isPlacing} rightIcon={<ArrowRight className="h-5 w-5" />}>
              Place Order · {formatPrice(total)}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
