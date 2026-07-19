'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { wishlistService } from '@/services/cart.service';
import type { Wishlist } from '@/types';

interface WishlistState {
  wishlist: Wishlist | null;
  isLoading: boolean;
  fetchWishlist: () => Promise<void>;
  addItem: (productId: string) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
}

export const useWishlistStore = create<WishlistState>()(
  (set, get) => ({
    wishlist: null,
    isLoading: false,

    fetchWishlist: async () => {
      try {
        const wishlist = await wishlistService.get();
        set({ wishlist });
      } catch {
        set({ wishlist: null });
      }
    },

    addItem: async (productId) => {
      const wishlist = await wishlistService.add(productId);
      set({ wishlist });
    },

    removeItem: async (productId) => {
      const wishlist = await wishlistService.remove(productId);
      set({ wishlist });
    },

    isInWishlist: (productId) => {
      const { wishlist } = get();
      return wishlist?.products?.some((p) => p.product._id === productId) ?? false;
    },
  })
);
