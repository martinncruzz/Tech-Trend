import { z } from 'zod';

import { PartialCartItemSchema } from '../../config/schemas/cart.schema';
import { PartialCategorySchema } from '../../config/schemas/category.schema';
import { PartialOrderItemSchema } from '../../config/schemas/order.schema';
import { Product } from '../../modules/products/entities/product.entity';

export const BaseProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  stock: z.number().int(),
  imageId: z.string(),
  imageUrl: z.string().url(),
  categoryId: z.string().uuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  category: z.lazy(() => PartialCategorySchema).optional(),
  cartItems: z.array(z.lazy(() => PartialCartItemSchema)).optional(),
  orderItems: z.array(z.lazy(() => PartialOrderItemSchema)).optional(),
});

export const ProductSchema: z.ZodSchema<Product> = BaseProductSchema;

export const PartialProductSchema: z.ZodSchema<Partial<Product>> = BaseProductSchema.partial();
