import { z } from 'zod';

import { PartialCartSchema } from '@config/schemas/cart.schema';
import { PartialOrderSchema } from '@config/schemas/order.schema';
import { User } from '@modules/users/entities/user.entity';
import { UserRoles } from '@modules/shared/interfaces/enums';

export const UserRolesSchema = z.nativeEnum(UserRoles);

export const BaseUserSchema = z.object({
  id: z.string().uuid(),
  fullname: z.string(),
  email: z.string().email(),
  password: z.string(),
  roles: z.array(UserRolesSchema),
  createdAt: z.date(),
  updatedAt: z.date(),
  cart: z.lazy(() => PartialCartSchema).optional(),
  orders: z.array(z.lazy(() => PartialOrderSchema)).optional(),
});

export const UserSchema: z.ZodSchema<User> = BaseUserSchema;

export const PartialUserSchema: z.ZodSchema<Partial<User>> = BaseUserSchema.partial();
