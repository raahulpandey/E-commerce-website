import api from '@/lib/axios';
import type { Product, ProductQuery } from '@/types';

export const productService = {
  getAll: async (query: ProductQuery = {}) => {
    const params = new URLSearchParams();
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') params.append(k, String(v));
    });
    const res = await api.get(`/products?${params}`);
    return res.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const res = await api.get(`/products/${id}`);
    return res.data.data.product;
  },

  getCategories: async () => {
    const res = await api.get('/products/categories');
    return res.data.data.categories;
  },

  create: async (data: Partial<Product>): Promise<Product> => {
    const res = await api.post('/products', data);
    return res.data.data.product;
  },

  update: async (id: string, data: Partial<Product>): Promise<Product> => {
    const res = await api.put(`/products/${id}`, data);
    return res.data.data.product;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },
};

export const categoryService = {
  getAll: async () => {
    const res = await api.get('/categories');
    return res.data.data.categories;
  },

  getBySlug: async (slug: string) => {
    const res = await api.get(`/categories/${slug}`);
    return res.data.data.category;
  },
};

export const reviewService = {
  getByProduct: async (productId: string, page = 1) => {
    const res = await api.get(`/products/${productId}/reviews?page=${page}`);
    return res.data.data;
  },

  add: async (productId: string, data: { rating: number; title?: string; comment: string }) => {
    const res = await api.post(`/products/${productId}/reviews`, data);
    return res.data.data.review;
  },

  update: async (reviewId: string, data: { rating?: number; title?: string; comment?: string }) => {
    const res = await api.put(`/reviews/${reviewId}`, data);
    return res.data.data.review;
  },

  delete: async (reviewId: string): Promise<void> => {
    await api.delete(`/reviews/${reviewId}`);
  },
};
