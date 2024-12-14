import { z } from 'zod';

process.loadEnvFile();

const envsSchema = z.object({
  PORT: z.coerce.number().int().positive('PORT must be a positive integer'),
  FRONTEND_URL: z.string().url('FRONTEND_URL must be a valid URL'),
  BACKEND_URL: z.string().url('BACKEND_URL must be a valid URL'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid URL'),
  JWT_SECRET: z.string().nonempty('JWT_SECRET is required'),

  CLOUDINARY_NAME: z.string().nonempty('CLOUDINARY_NAME is required'),
  CLOUDINARY_API_KEY: z.string().nonempty('CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().nonempty('CLOUDINARY_API_SECRET is required'),

  STRIPE_SECRET_KEY: z.string().nonempty('STRIPE_SECRET_KEY is required'),
  STRIPE_ENDPOINT_SECRET: z.string().nonempty('STRIPE_ENDPOINT_SECRET is required'),
});

const { success, error, data } = envsSchema.safeParse(process.env);

if (!success) {
  console.error('❌ Error in environment variables:', error.format());
  process.exit(1);
}

export const envs = data;
