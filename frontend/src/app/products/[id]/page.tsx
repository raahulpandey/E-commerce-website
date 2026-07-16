'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Heart, Minus, Plus, Star, Check, Share2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { productService, reviewService } from '@/services/product.service';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { RatingStars } from '@/components/ui/RatingStars';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { Skeleton } from '@/components/ui/Skeleton';
import { formatPrice, getEffectivePrice, getDiscountPercentage } from '@/utils';
import type { Review } from '@/types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewTitle, setReviewTitle] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const { addItem: addToCart } = useCartStore();
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id),
  });

  const { data: reviewData, refetch: refetchReviews } = useQuery({
    queryKey: ['reviews', id],
    queryFn: () => reviewService.getByProduct(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="aspect-square rounded-3xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-10 w-1/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const effectivePrice = getEffectivePrice(product.price, product.discountedPrice);
  const discountPct = getDiscountPercentage(product.price, product.discountedPrice);
  const isWishlisted = isInWishlist(product._id);
  const isOutOfStock = product.stock === 0;

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please sign in to add items to cart'); return; }
    await addToCart(product._id, qty);
    toast.success(`${qty} item(s) added to cart!`);
  };

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) { toast.error('Please sign in to use wishlist'); return; }
    if (isWishlisted) {
      await removeFromWishlist(product._id);
      toast.success('Removed from wishlist');
    } else {
      await addToWishlist(product._id);
      toast.success('Added to wishlist!');
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) { toast.error('Please sign in to leave a review'); return; }
    if (reviewComment.length < 10) { toast.error('Comment must be at least 10 characters'); return; }
    setSubmittingReview(true);
    try {
      await reviewService.add(id, { rating: reviewRating, title: reviewTitle, comment: reviewComment });
      toast.success('Review submitted!');
      setReviewComment('');
      setReviewTitle('');
      setReviewRating(5);
      refetchReviews();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Breadcrumb items={[{ label: 'Shop', href: '/shop' }, { label: product.title }]} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="relative aspect-square rounded-3xl overflow-hidden bg-slate-100 dark:bg-slate-800 mb-4"
          >
            <Image
              src={product.images?.[selectedImage] || '/placeholder.jpg'}
              alt={product.title}
              fill
              priority
              className="object-cover"
            />
            {discountPct > 0 && (
              <div className="absolute top-4 left-4">
                <Badge variant="danger" size="md">-{discountPct}% OFF</Badge>
              </div>
            )}
          </motion.div>

          {product.images?.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative h-16 w-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === i
                      ? 'border-violet-500 shadow-md shadow-violet-500/30'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Image src={img} alt={`${product.title} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-5">
          {product.brand && (
            <p className="text-violet-600 dark:text-violet-400 font-semibold text-sm uppercase tracking-wider">
              {product.brand}
            </p>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
            {product.title}
          </h1>

          <div className="flex items-center gap-3">
            <RatingStars rating={product.rating.average} count={product.rating.count} showCount size="md" />
          </div>

          {/* Price */}
          <div className="flex items-end gap-3">
            <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
              {formatPrice(effectivePrice)}
            </span>
            {discountPct > 0 && (
              <span className="text-lg text-slate-400 line-through mb-0.5">
                {formatPrice(product.price)}
              </span>
            )}
            {discountPct > 0 && (
              <span className="text-green-600 dark:text-green-400 text-sm font-bold mb-0.5">
                You save {formatPrice(product.price - effectivePrice)}
              </span>
            )}
          </div>

          {/* Stock */}
          <div className="flex items-center gap-2">
            {isOutOfStock ? (
              <Badge variant="danger">Out of Stock</Badge>
            ) : product.stock <= 10 ? (
              <Badge variant="warning">Only {product.stock} left in stock</Badge>
            ) : (
              <Badge variant="success">
                <Check className="h-3 w-3 mr-1" /> In Stock
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{product.description}</p>

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="flex items-center gap-4">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">Qty:</p>
              <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
                <button
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-bold text-slate-900 dark:text-white">{qty}</span>
                <button
                  onClick={() => setQty(Math.min(product.stock, qty + 1))}
                  className="p-2 rounded-lg hover:bg-white dark:hover:bg-slate-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              fullWidth
              size="lg"
              disabled={isOutOfStock}
              leftIcon={<ShoppingCart className="h-5 w-5" />}
              onClick={handleAddToCart}
            >
              {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <button
              onClick={handleWishlistToggle}
              className={`p-3.5 rounded-xl border-2 transition-all ${
                isWishlisted
                  ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-500'
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:border-red-400 hover:text-red-500'
              }`}
            >
              <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied!');
              }}
              className="p-3.5 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-violet-400 hover:text-violet-500 transition-all"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
          Customer Reviews
          {reviewData?.pagination?.total > 0 && (
            <span className="ml-2 text-slate-400 font-normal text-lg">
              ({reviewData.pagination.total})
            </span>
          )}
        </h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Write a Review */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Your Rating</p>
                <RatingStars
                  rating={reviewRating}
                  interactive
                  onChange={setReviewRating}
                  size="lg"
                />
              </div>
              <input
                type="text"
                placeholder="Review title (optional)"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white"
              />
              <textarea
                placeholder="Share your experience..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={4}
                required
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-white resize-none"
              />
              <Button fullWidth isLoading={submittingReview} type="submit">
                Submit Review
              </Button>
            </form>
          </div>

          {/* Review List */}
          <div className="lg:col-span-2 space-y-4">
            {reviewData?.reviews?.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                No reviews yet. Be the first!
              </div>
            ) : (
              reviewData?.reviews?.map((review: Review) => (
                <motion.div
                  key={review._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-5"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                          {review.user.name[0]?.toUpperCase()}
                        </div>
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {review.user.name}
                        </span>
                        {review.isVerifiedPurchase && (
                          <Badge variant="success" size="sm">Verified</Badge>
                        )}
                      </div>
                      <RatingStars rating={review.rating} size="sm" />
                    </div>
                    <span className="text-xs text-slate-400">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  {review.title && (
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-1">{review.title}</h4>
                  )}
                  <p className="text-sm text-slate-600 dark:text-slate-400">{review.comment}</p>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
