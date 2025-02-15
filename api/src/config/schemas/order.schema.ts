import { z } from 'zod';

import { Order } from '../../modules/orders/entities/order.entity';
import { OrderItem } from '../../modules/orders/entities/order-item.entity';
import { OrderStatus } from '../../modules/shared/interfaces/enums';
import { PartialProductSchema } from '../../config/schemas/product.schema';
import { PartialUserSchema } from '../../config/schemas/user.schema';

export const OrderStatusSchema = z.nativeEnum(OrderStatus);

export const BaseOrderItemSchema = z.object({
  id: z.string().uuid(),
  orderId: z.string().uuid(),
  productId: z.string().uuid(),
  quantity: z.number().int(),
  subtotal: z.number(),
  createdAt: z.date(),
  updatedAt: z.date(),
  order: z.lazy(() => PartialOrderSchema).optional(),
  product: z.lazy(() => PartialProductSchema).optional(),
});

export const OrderItemSchema: z.ZodSchema<OrderItem> = BaseOrderItemSchema;

export const PartialOrderItemSchema: z.ZodSchema<Partial<OrderItem>> = BaseOrderItemSchema.partial();

export const BaseOrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  total: z.number(),
  status: OrderStatusSchema,
  receiptUrl: z.string().url(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.lazy(() => PartialUserSchema).optional(),
  items: z.array(z.lazy(() => PartialOrderItemSchema)).optional(),
});

export const OrderSchema: z.ZodSchema<Order> = BaseOrderSchema;

export const PartialOrderSchema: z.ZodSchema<Partial<Order>> = BaseOrderSchema.partial();
