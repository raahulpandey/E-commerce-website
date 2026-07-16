import api from '@/lib/axios';
import type { Cart } from '@/types';

export const cartService = {
  get: async (): Promise<Cart> => {
    const res = await api.get('/cart');
    return res.data.data.cart;
  },

  add: async (productId: string, quantity = 1): Promise<Cart> => {
    const res = await api.post('/cart', { productId, quantity });
    return res.data.data.cart;
  },

  update: async (productId: string, quantity: number): Promise<Cart> => {
    const res = await api.patch(`/cart/${productId}`, { quantity });
    return res.data.data.cart;
  },

  remove: async (productId: string): Promise<Cart> => {
    const res = await api.delete(`/cart/${productId}`);
    return res.data.data.cart;
  },

  clear: async (): Promise<void> => {
    await api.delete('/cart');
  },
};

export const wishlistService = {
  get: async () => {
    const res = await api.get('/wishlist');
    return res.data.data.wishlist;
  },

  add: async (productId: string) => {
    const res = await api.post('/wishlist', { productId });
    return res.data.data.wishlist;
  },

  remove: async (productId: string) => {
    const res = await api.delete(`/wishlist/${productId}`);
    return res.data.data.wishlist;
  },

  clear: async (): Promise<void> => {
    await api.delete('/wishlist');
  },
};
