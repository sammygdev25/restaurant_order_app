import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { z } from 'zod';
import { Category, Dish, Cart, CartItem, Order, OrderItem, Reservation, CategorySchema, DishSchema, CartSchema, CartItemSchema, OrderSchema, OrderItemSchema, ReservationSchema, PaginatedResponseSchema } from './types';

const API_BASE_URL = '/api';

// Auto-detect K8s preview proxy and rewrite API URLs
const isProxied = window.location.pathname.includes('/preview/proxy');
const proxyBase = isProxied
  ? window.location.pathname.replace(/\/preview\/proxy.*/, '/preview/proxy')
  : '';

const api: AxiosInstance = axios.create({
  baseURL: proxyBase + API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Auth interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }
  return config;
});

// On a 401 with a stored refresh token (the Express track issues one), refresh once and retry.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as (InternalAxiosRequestConfig & { _retried?: boolean }) | undefined;
    const refreshToken = localStorage.getItem('refreshToken');
    if (error.response?.status === 401 && refreshToken && original && !original._retried) {
      original._retried = true;
      try {
        const res = await axios.post(proxyBase + API_BASE_URL + '/auth/refresh/', { refreshToken });
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        return api(original);
      } catch {
        localStorage.removeItem('refreshToken');
      }
    }
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      localStorage.removeItem('token');
      if (originalRequest.method === 'get') {
        originalRequest._retry = true;
        delete originalRequest.headers.Authorization;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

// Response validation is advisory: a schema mismatch must never blank a page.
const parseOr = <S extends z.ZodTypeAny>(schema: S, data: unknown): z.output<S> => {
  const result = schema.safeParse(data);
  if (!result.success) {
    console.warn('[api] response did not match schema, using raw data:', result.error.issues.slice(0, 3));
    return data as z.output<S>;
  }
  return result.data;
};

// Auth API
export const login = (credentials: { username: string; password: string }) =>
  api.post('/auth/login/', credentials);
export const register = (data: { username: string; email: string; password: string }) =>
  api.post('/auth/register/', data);
export const logout = () => api.post('/auth/logout/');
export const getProfile = () => api.get('/auth/profile/');

// ── Category API ──
export const getCategoryList = async (params?: Record<string, unknown>): Promise<Category[]> => {
  const res = await api.get('/categories/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.categories ?? res.data?.categories ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(CategorySchema), data) as Category[];
};

export const getCategory = async (id: number | string | Record<string, unknown>): Promise<Category> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getCategoryList(id) as unknown as Promise<Category>;
  const res = await api.get(`/categories/${id}/`);
  return parseOr(CategorySchema, res.data) as Category;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createCategory = async (data: Partial<Omit<Category, 'id'>>): Promise<Category> => {
  const res = await api.post('/categories/', data);
  return parseOr(CategorySchema, res.data) as Category;
};

export const updateCategory = async (id: number, data: Partial<Category>): Promise<Category> => {
  const res = await api.patch(`/categories/${id}/`, data);
  return parseOr(CategorySchema, res.data) as Category;
};

export const deleteCategory = async (id: number) => {
  await api.delete(`/categories/${id}/`);
};

// ── Dish API ──
export const getDishList = async (params?: Record<string, unknown>): Promise<Dish[]> => {
  const res = await api.get('/dishes/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.dishes ?? res.data?.dishes ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(DishSchema), data) as Dish[];
};

export const getDish = async (id: number | string | Record<string, unknown>): Promise<Dish> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getDishList(id) as unknown as Promise<Dish>;
  const res = await api.get(`/dishes/${id}/`);
  return parseOr(DishSchema, res.data) as Dish;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createDish = async (data: Partial<Omit<Dish, 'id'>>): Promise<Dish> => {
  const res = await api.post('/dishes/', data);
  return parseOr(DishSchema, res.data) as Dish;
};

export const updateDish = async (id: number, data: Partial<Dish>): Promise<Dish> => {
  const res = await api.patch(`/dishes/${id}/`, data);
  return parseOr(DishSchema, res.data) as Dish;
};

export const deleteDish = async (id: number) => {
  await api.delete(`/dishes/${id}/`);
};

// ── Cart API ──
export const getCartList = async (params?: Record<string, unknown>): Promise<Cart[]> => {
  const res = await api.get('/cart/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.carts ?? res.data?.carts ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(CartSchema), data) as Cart[];
};

export const getCart = async (id: number | string | Record<string, unknown>): Promise<Cart> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getCartList(id) as unknown as Promise<Cart>;
  const res = await api.get(`/cart/${id}/`);
  return parseOr(CartSchema, res.data) as Cart;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createCart = async (data: Partial<Omit<Cart, 'id'>>): Promise<Cart> => {
  const res = await api.post('/carts/', data);
  return parseOr(CartSchema, res.data) as Cart;
};

export const updateCart = async (id: number, data: Partial<Cart>): Promise<Cart> => {
  const res = await api.patch(`/carts/${id}/`, data);
  return parseOr(CartSchema, res.data) as Cart;
};

export const deleteCart = async (id: number) => {
  await api.delete(`/carts/${id}/`);
};

// ── CartItem API ──
export const getCartItemList = async (params?: Record<string, unknown>): Promise<CartItem[]> => {
  const res = await api.get('/cart-items/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.cart_items ?? res.data?.cartItems ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(CartItemSchema), data) as CartItem[];
};

export const getCartItem = async (id: number | string | Record<string, unknown>): Promise<CartItem> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getCartItemList(id) as unknown as Promise<CartItem>;
  const res = await api.get(`/cart-items/${id}/`);
  return parseOr(CartItemSchema, res.data) as CartItem;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createCartItem = async (data: Partial<Omit<CartItem, 'id'>>): Promise<CartItem> => {
  const res = await api.post('/cart-items/', data);
  return parseOr(CartItemSchema, res.data) as CartItem;
};

export const updateCartItem = async (id: number, data: Partial<CartItem>): Promise<CartItem> => {
  const res = await api.patch(`/cart-items/${id}/`, data);
  return parseOr(CartItemSchema, res.data) as CartItem;
};

export const deleteCartItem = async (id: number) => {
  await api.delete(`/cart-items/${id}/`);
};

// ── Order API ──
export const getOrderList = async (params?: Record<string, unknown>): Promise<Order[]> => {
  const res = await api.get('/orders/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.orders ?? res.data?.orders ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(OrderSchema), data) as Order[];
};

export const getOrder = async (id: number | string | Record<string, unknown>): Promise<Order> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getOrderList(id) as unknown as Promise<Order>;
  const res = await api.get(`/orders/${id}/`);
  return parseOr(OrderSchema, res.data) as Order;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createOrder = async (data: Partial<Omit<Order, 'id'>>): Promise<Order> => {
  const res = await api.post('/orders/', data);
  return parseOr(OrderSchema, res.data) as Order;
};

export const updateOrder = async (id: number, data: Partial<Order>): Promise<Order> => {
  const res = await api.patch(`/orders/${id}/`, data);
  return parseOr(OrderSchema, res.data) as Order;
};

export const deleteOrder = async (id: number) => {
  await api.delete(`/orders/${id}/`);
};

// ── OrderItem API ──
export const getOrderItemList = async (params?: Record<string, unknown>): Promise<OrderItem[]> => {
  const res = await api.get('/order_items/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.order_items ?? res.data?.orderItems ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(OrderItemSchema), data) as OrderItem[];
};

export const getOrderItem = async (id: number | string | Record<string, unknown>): Promise<OrderItem> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getOrderItemList(id) as unknown as Promise<OrderItem>;
  const res = await api.get(`/order_items/${id}/`);
  return parseOr(OrderItemSchema, res.data) as OrderItem;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createOrderItem = async (data: Partial<Omit<OrderItem, 'id'>>): Promise<OrderItem> => {
  const res = await api.post('/order_items/', data);
  return parseOr(OrderItemSchema, res.data) as OrderItem;
};

export const updateOrderItem = async (id: number, data: Partial<OrderItem>): Promise<OrderItem> => {
  const res = await api.patch(`/order_items/${id}/`, data);
  return parseOr(OrderItemSchema, res.data) as OrderItem;
};

export const deleteOrderItem = async (id: number) => {
  await api.delete(`/order_items/${id}/`);
};

// ── Reservation API ──
export const getReservationList = async (params?: Record<string, unknown>): Promise<Reservation[]> => {
  const res = await api.get('/reservations/', params ? { params } : undefined);
  const data = Array.isArray(res.data) ? res.data : (res.data?.results ?? res.data?.data ?? res.data?.items ?? res.data?.reservations ?? res.data?.reservations ?? []);
  // The interface is the strict type: a field name the API does not send is a compile error, not an unknown.
  return parseOr(z.array(ReservationSchema), data) as Reservation[];
};

export const getReservation = async (id: number | string | Record<string, unknown>): Promise<Reservation> => {
  // Pages sometimes call the detail getter with a filter object; route that to the list endpoint.
  if (typeof id === 'object' && id !== null) return getReservationList(id) as unknown as Promise<Reservation>;
  const res = await api.get(`/reservations/${id}/`);
  return parseOr(ReservationSchema, res.data) as Reservation;
};

// Create sends the fields a form holds; the server sets owner, status, totals and times, and validates.
export const createReservation = async (data: Partial<Omit<Reservation, 'id'>>): Promise<Reservation> => {
  const res = await api.post('/reservations/', data);
  return parseOr(ReservationSchema, res.data) as Reservation;
};

export const updateReservation = async (id: number, data: Partial<Reservation>): Promise<Reservation> => {
  const res = await api.patch(`/reservations/${id}/`, data);
  return parseOr(ReservationSchema, res.data) as Reservation;
};

export const deleteReservation = async (id: number) => {
  await api.delete(`/reservations/${id}/`);
};


// Auth aliases — domain agents use varied naming conventions
export const loginUser = (email: string, password: string) => api.post('/auth/login/', { username: email, password });
export const registerUser = (userData: any) => api.post('/auth/register/', userData);
export const getCurrentUser = getProfile;
export const updateUserProfile = (data: Partial<any>) => api.patch('/auth/profile/', data);

export { api };
export default api;
