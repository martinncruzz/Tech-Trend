import { z } from 'zod';

import { Category } from '@modules/categories/entities/category.entity';
import { PartialProductSchema } from '@config/schemas/product.schema';

export const BaseCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  products: z.array(z.lazy(() => PartialProductSchema)).optional(),
});

export const CategorySchema: z.ZodSchema<Category> = BaseCategorySchema;

export const PartialCategorySchema: z.ZodSchema<Partial<Category>> = BaseCategorySchema.partial();
