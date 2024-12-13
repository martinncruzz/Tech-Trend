import { z } from 'zod';

process.loadEnvFile();

const envsSchema = z.object({
  PORT: z.coerce.number(),
  FRONTEND_URL: z.string().url('FRONTEND_URL is required'),
  BACKEND_URL: z.string().url('BACKEND_URL is required'),
  DATABASE_URL: z.string().url('DATABASE_URL is required'),
  JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
  CLOUDINARY_NAME: z.string().min(1, 'CLOUDINARY_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),
  STRIPE_SECRET_KEY: z.string().min(1, 'STRIPE_SECRET_KEY is required'),
  STRIPE_ENDPOINT_SECRET: z.string().min(1, 'STRIPE_ENDPOINT_SECRET is required'),
});

const { success, error, data } = envsSchema.safeParse(process.env);

if (!success) {
  console.error('❌ Error in environment variables:', error.format());
  process.exit(1);
}

export const envs = {
  PORT: data.PORT,
  FRONTEND_URL: data.FRONTEND_URL,
  BACKEND_URL: data.BACKEND_URL,
  DATABASE_URL: data.DATABASE_URL,
  JWT_SECRET: data.JWT_SECRET,

  CLOUDINARY_NAME: data.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: data.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: data.CLOUDINARY_API_SECRET,

  STRIPE_SECRET_KEY: data.STRIPE_SECRET_KEY,
  STRIPE_ENDPOINT_SECRET: data.STRIPE_ENDPOINT_SECRET,
};
