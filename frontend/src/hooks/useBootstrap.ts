'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';

/**
 * Bootstrap hook — runs on app mount to rehydrate all global stores.
 * Fetches current user session, cart, and wishlist from the API.
 */
export function useBootstrap() {
  const { fetchProfile, isAuthenticated } = useAuthStore();
  const { fetchCart } = useCartStore();
  const { fetchWishlist } = useWishlistStore();

  useEffect(() => {
    // Rehydrate user session from cookie
    fetchProfile().catch(() => {
      // Silently fail — user is not logged in
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      // Fetch cart and wishlist once authenticated
      fetchCart().catch(() => {});
      fetchWishlist().catch(() => {});
    }
  }, [isAuthenticated]);
}
