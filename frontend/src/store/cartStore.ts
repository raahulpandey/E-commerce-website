'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Cart, CartItem } from '@/types';
import { cartService } from '@/services/cart.service';

interface CartState {
  cart: Cart | null;
  isOpen: boolean;
  isLoading: boolean;
  openCart: () => void;
  closeCart: () => void;
  fetchCart: () => Promise<void>;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  (set, get) => ({
    cart: null,
    isOpen: false,
    isLoading: false,

    openCart: () => set({ isOpen: true }),
    closeCart: () => set({ isOpen: false }),

    fetchCart: async () => {
      set({ isLoading: true });
      try {
        const cart = await cartService.get();
        set({ cart });
      } catch {
        set({ cart: null });
      } finally {
        set({ isLoading: false });
      }
    },

    addItem: async (productId, quantity = 1) => {
      set({ isLoading: true });
      try {
        const cart = await cartService.add(productId, quantity);
        set({ cart, isOpen: true });
      } finally {
        set({ isLoading: false });
      }
    },

    updateItem: async (productId, quantity) => {
      const cart = await cartService.update(productId, quantity);
      set({ cart });
    },

    removeItem: async (productId) => {
      const cart = await cartService.remove(productId);
      set({ cart });
    },

    clearCart: async () => {
      await cartService.clear();
      set({ cart: null });
    },

    getTotalItems: () => get().cart?.totalItems ?? 0,
    getTotalPrice: () => get().cart?.totalPrice ?? 0,
  })
);
