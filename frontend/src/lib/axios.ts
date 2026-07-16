import axios from 'axios';
import { toast } from 'sonner';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Send cookies (HttpOnly JWT)
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==============================
// Request Interceptor
// ==============================
api.interceptors.request.use(
  (config) => {
    // Attach access token from localStorage if present (for non-cookie clients)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ==============================
// Response Interceptor
// ==============================
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'Something went wrong. Please try again.';

    // Don't show toasts for auth checks (silent failures)
    const silentUrls = ['/auth/profile'];
    const isSilent = silentUrls.some((url) => error.config?.url?.includes(url));

    if (!isSilent && error.response?.status !== 401) {
      toast.error(message);
    }

    // Token expired — clear local storage
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      if (!silentUrls.some((url) => error.config?.url?.includes(url))) {
        localStorage.removeItem('accessToken');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
