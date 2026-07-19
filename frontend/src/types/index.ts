// ==============================
// Shared TypeScript Types
// ==============================

export interface User {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'user' | 'admin';
  address?: Address;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  label?: string;
  fullName?: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  icon?: string;
  isActive: boolean;
  order: number;
}

export interface ProductRating {
  average: number;
  count: number;
}

export interface Product {
  _id: string;
  title: string;
  description: string;
  price: number;
  discountedPrice?: number;
  effectivePrice?: number;
  discountPercentage?: number;
  category: string | Category;
  brand?: string;
  images: string[];
  stock: number;
  rating: ProductRating;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  price: number;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface WishlistItem {
  product: Product;
  addedAt: string;
}

export interface Wishlist {
  _id: string;
  user: string;
  products: WishlistItem[];
}

export interface OrderItem {
  product: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
export type PaymentMethod = 'cod' | 'online';

export interface Order {
  _id: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: Address;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
  cancellationReason?: string;
}

export interface Review {
  _id: string;
  product: string;
  user: Pick<User, '_id' | 'name'>;
  rating: number;
  title?: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface Coupon {
  _id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount: number;
  maxDiscount?: number;
  expiresAt: string;
  isActive: boolean;
}

export interface CouponValidationResult {
  couponId: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  discount: number;
}

// ==============================
// API Response Types
// ==============================

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  limit: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

// ==============================
// Query / Filter Types
// ==============================

export interface ProductQuery {
  search?: string;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  sortBy?: 'price_asc' | 'price_desc' | 'rating_desc' | 'newest';
  page?: number;
  limit?: number;
}

// ==============================
// Auth Types
// ==============================

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

// ==============================
// Dashboard Types
// ==============================

export interface DashboardStats {
  overview: {
    totalOrders: number;
    totalRevenue: number;
    avgOrderValue: number;
    totalUsers: number;
    activeUsers: number;
    totalProducts: number;
    outOfStock: number;
  };
  monthlyComparison: {
    thisMonth: { revenue: number; orders: number };
    lastMonth: { revenue: number; orders: number };
    revenueGrowth: number;
  };
  topProducts: Array<{
    _id: string;
    title: string;
    totalSold: number;
    totalRevenue: number;
  }>;
  recentOrders: Order[];
  ordersByStatus: Array<{ _id: string; count: number }>;
  revenueByDay: Array<{ _id: string; revenue: number; orders: number }>;
}
