import api from '@/lib/axios';
import type { Order, Address } from '@/types';

export const orderService = {
  create: async (data: {
    shippingAddress: Omit<Address, '_id' | 'isDefault' | 'label'>;
    paymentMethod?: 'cod' | 'online';
    couponCode?: string;
  }): Promise<Order> => {
    const res = await api.post('/orders', data);
    return res.data.data.order;
  },

  getAll: async (page = 1, status?: string) => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.append('status', status);
    const res = await api.get(`/orders?${params}`);
    return res.data.data;
  },

  getById: async (id: string): Promise<Order> => {
    const res = await api.get(`/orders/${id}`);
    return res.data.data.order;
  },

  cancel: async (id: string, reason?: string): Promise<Order> => {
    const res = await api.patch(`/orders/${id}/cancel`, { reason });
    return res.data.data.order;
  },

  // Admin
  adminGetAll: async (page = 1, status?: string) => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.append('status', status);
    const res = await api.get(`/orders/admin/all?${params}`);
    return res.data.data;
  },

  adminUpdateStatus: async (id: string, status: string, note?: string) => {
    const res = await api.patch(`/orders/admin/${id}/status`, { status, note });
    return res.data.data.order;
  },

  adminGetStats: async () => {
    const res = await api.get('/orders/admin/stats');
    return res.data.data.stats;
  },
};

export const addressService = {
  getAll: async () => {
    const res = await api.get('/addresses');
    return res.data.data.addresses;
  },

  add: async (data: Omit<Address, '_id'>) => {
    const res = await api.post('/addresses', data);
    return res.data.data.address;
  },

  update: async (id: string, data: Partial<Address>) => {
    const res = await api.put(`/addresses/${id}`, data);
    return res.data.data.address;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/addresses/${id}`);
  },

  setDefault: async (id: string) => {
    const res = await api.patch(`/addresses/${id}/default`);
    return res.data.data.addresses;
  },
};

export const couponService = {
  validate: async (code: string, orderTotal: number) => {
    const res = await api.post('/coupons/validate', { code, orderTotal });
    return res.data.data;
  },
};
