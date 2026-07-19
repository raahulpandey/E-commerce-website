import api from '@/lib/axios';
import type { AuthResponse, LoginCredentials, RegisterData, User } from '@/types';

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const res = await api.post('/auth/register', data);
    return res.data.data;
  },

  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', credentials);
    const { user, accessToken } = res.data.data;
    if (accessToken && typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
    }
    return { user, accessToken };
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get('/auth/profile');
    return res.data.data.user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await api.put('/auth/profile', data);
    return res.data.data.user;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<void> => {
    await api.put('/auth/change-password', data);
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  resetPassword: async (token: string, password: string): Promise<void> => {
    await api.post('/auth/reset-password', { token, password });
  },
};
