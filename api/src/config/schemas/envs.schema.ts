import { z } from 'zod';

export const envsSchema = z.object({
  PORT: z.coerce.number().int().positive('PORT must be a positive integer'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
  BACKEND_URL: z.string().url('BACKEND_URL must be a valid URL'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),

  CLOUDINARY_NAME: z.string().min(1, 'CLOUDINARY_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_ENDPOINT_SECRET: z.string().min(1, 'STRIPE_ENDPOINT_SECRET is required'),
});
