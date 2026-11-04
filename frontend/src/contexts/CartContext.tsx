import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import api from '../api';
import type { Dish } from '../types';

export interface CartItemType {
  id: number;
  cart: number;
  dish: Dish;
  quantity: number;
  created_at: string;
  updated_at: string;
}

interface CartContextValue {
  items: CartItemType[];
  subtotal: number;
  itemCount: number;
  loading: boolean;
  addItem: (dishId: number, quantity?: number) => Promise<void>;
  removeItem: (itemId: number) => Promise<void>;
  updateQuantity: (itemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

function extractList(data: any): any[] {
  return Array.isArray(data) ? data : (data?.results || data?.data || data?.items || []);
}

function computeTotals(items: CartItemType[]) {
  const subtotal = items.reduce((sum, it) => {
    const price = it.dish && it.dish.price ? parseFloat(String(it.dish.price)) : 0;
    return sum + price * it.quantity;
  }, 0);
  const itemCount = items.reduce((sum, it) => sum + it.quantity, 0);
  return { subtotal, itemCount };
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItemType[]>([]);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [itemCount, setItemCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [cartId, setCartId] = useState<number | null>(null);

  const applyItems = useCallback((newItems: CartItemType[]) => {
    const totals = computeTotals(newItems);
    setItems(newItems);
    setSubtotal(totals.subtotal);
    setItemCount(totals.itemCount);
  }, []);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get('/cart/');
      const carts = extractList(response.data);
      let cart = carts.length > 0 ? carts[0] : null;

      if (!cart) {
        const createResponse = await api.post('/cart/', {});
        cart = createResponse.data;
      }

      setCartId(cart.id);
      const cartItems: CartItemType[] = Array.isArray(cart.items) ? cart.items : [];
      applyItems(cartItems);
    } catch (err) {
      applyItems([]);
    } finally {
      setLoading(false);
    }
  }, [applyItems]);

  const ensureCartId = useCallback(async (): Promise<number> => {
    if (cartId) return cartId;
    const response = await api.get('/cart/');
    const carts = extractList(response.data);
    if (carts.length > 0) {
      setCartId(carts[0].id);
      return carts[0].id;
    }
    const createResponse = await api.post('/cart/', {});
    setCartId(createResponse.data.id);
    return createResponse.data.id;
  }, [cartId]);

  const addItem = useCallback(async (dishId: number, quantity: number = 1) => {
    setLoading(true);
    try {
      const id = await ensureCartId();
      const existing = items.find((it) => it.dish && it.dish.id === dishId);
      if (existing) {
        await api.patch(`/cart-items/${existing.id}/`, { quantity: existing.quantity + quantity });
      } else {
        await api.post('/cart-items/', { cart: id, dish: dishId, quantity });
      }
      await fetchCart();
    } finally {
      setLoading(false);
    }
  }, [ensureCartId, items, fetchCart]);

  const removeItem = useCallback(async (itemId: number) => {
    setLoading(true);
    try {
      await api.delete(`/cart-items/${itemId}/`);
      applyItems(items.filter((it) => it.id !== itemId));
    } finally {
      setLoading(false);
    }
  }, [items, applyItems]);

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeItem(itemId);
      return;
    }
    setLoading(true);
    try {
      await api.patch(`/cart-items/${itemId}/`, { quantity });
      applyItems(items.map((it) => (it.id === itemId ? { ...it, quantity } : it)));
    } finally {
      setLoading(false);
    }
  }, [items, applyItems, removeItem]);

  const clearCart = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all(items.map((it) => api.delete(`/cart-items/${it.id}/`)));
      applyItems([]);
    } finally {
      setLoading(false);
    }
  }, [items, applyItems]);

  const value: CartContextValue = {
    items,
    subtotal,
    itemCount,
    loading,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    fetchCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}