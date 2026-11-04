/**
 * Auto-generated TypeScript types and Zod schemas from ProjectContract.
 * Model interfaces match the Django backend exactly.
 */
import { z } from 'zod';

// DRF returns a related object either as its pk or nested; parse both to the pk
// so the parsed type matches the number typed FK fields on the interfaces.
const zRelation = z.union([z.coerce.number().int(), z.object({ id: z.coerce.number().int() }).passthrough()]).transform((v) => (typeof v === 'number' ? v : v.id));

// ── Category ──
export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export const CategorySchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Dish ──
export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  image: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export const DishSchema = z.object({
  id: z.coerce.number(),
  name: z.string(),
  description: z.string(),
  price: z.coerce.number(),
  category: zRelation,
  image: z.string().nullable().nullable(),
  is_available: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Cart ──
export interface Cart {
  id: number;
  user: number;
  created_at: string;
  updated_at: string;
}

export const CartSchema = z.object({
  id: z.coerce.number(),
  user: zRelation,
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── CartItem ──
export interface CartItem {
  id: number;
  cart: number;
  dish: number;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export const CartItemSchema = z.object({
  id: z.coerce.number(),
  cart: zRelation,
  dish: zRelation,
  quantity: z.coerce.number().int().nonnegative(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Order ──
export interface Order {
  id: number;
  user: number;
  order_type: string;
  status: string;
  delivery_address: string;
  phone: string;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  stripe_payment_intent_id: string;
  created_at: string;
  updated_at: string;
}

export const OrderSchema = z.object({
  id: z.coerce.number(),
  user: zRelation,
  order_type: z.string(),
  status: z.string(),
  delivery_address: z.string(),
  phone: z.string(),
  subtotal: z.coerce.number(),
  delivery_fee: z.coerce.number(),
  total_amount: z.coerce.number(),
  stripe_payment_intent_id: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── OrderItem ──
export interface OrderItem {
  id: number;
  order: number;
  dish: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
}

export const OrderItemSchema = z.object({
  id: z.coerce.number(),
  order: zRelation,
  dish: zRelation,
  quantity: z.coerce.number().int().nonnegative(),
  price: z.coerce.number(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Reservation ──
export interface Reservation {
  id: number;
  user: number;
  date: string;
  time: string;
  party_size: number;
  status: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export const ReservationSchema = z.object({
  id: z.coerce.number(),
  user: zRelation,
  date: z.string(),
  time: z.string(),
  party_size: z.coerce.number().int().nonnegative(),
  status: z.string(),
  notes: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
}).passthrough();

// ── Paginated Response ──
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const PaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    count: z.coerce.number(),
    next: z.string().nullable(),
    previous: z.string().nullable(),
    results: z.array(itemSchema),
  });

