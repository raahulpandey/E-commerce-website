import api from '@/lib/axios';
import type { DashboardStats } from '@/types';

export const adminService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const res = await api.get('/dashboard/stats');
    return res.data.data.stats;
  },

  // Users
  getAllUsers: async (page = 1) => {
    const res = await api.get(`/users/admin/all?page=${page}`);
    return res.data.data;
  },

  updateUserRole: async (id: string, role: 'user' | 'admin') => {
    const res = await api.patch(`/users/admin/${id}/role`, { role });
    return res.data.data.user;
  },

  toggleUserStatus: async (id: string) => {
    const res = await api.patch(`/users/admin/${id}/toggle-status`);
    return res.data.data.user;
  },

  // Admin orders
  getAllOrders: async (page = 1, status?: string) => {
    const params = new URLSearchParams({ page: String(page) });
    if (status) params.append('status', status);
    const res = await api.get(`/orders/admin/all?${params}`);
    return res.data.data;
  },

  updateOrderStatus: async (id: string, status: string, note?: string) => {
    const res = await api.patch(`/orders/admin/${id}/status`, { status, note });
    return res.data.data.order;
  },
};
