import { z } from 'zod';

import { Cart } from '@modules/carts/entities/cart.entity';
import { CartItem } from '@modules/carts/entities/cart-item.entity';
import { PartialProductSchema } from '@config/schemas/product.schema';
import { PartialUserSchema } from '@config/schemas/user.schema';

export const BaseCartItemSchema = z.object({
  id: z.string().uuid(),
  cartId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int(),
  subtotal: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  cart: z.lazy(() => PartialCartSchema).optional(),
  product: z.lazy(() => PartialProductSchema).optional(),
});

export const CartItemSchema: z.ZodSchema<CartItem> = BaseCartItemSchema;

export const PartialCartItemSchema: z.ZodSchema<Partial<CartItem>> = BaseCartItemSchema.partial();

export const BaseCartSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  total: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.lazy(() => PartialUserSchema).optional(),
  items: z.array(z.lazy(() => PartialCartItemSchema)).optional(),
});

export const CartSchema: z.ZodSchema<Cart> = BaseCartSchema;

export const PartialCartSchema: z.ZodSchema<Partial<Cart>> = BaseCartSchema.partial();
