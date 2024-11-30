import { get } from 'env-var';

process.loadEnvFile();

export const envs = {
  PORT: get('PORT').required().asPortNumber(),
  FRONTEND_URL: get('FRONTEND_URL').required().asString(),
  BACKEND_URL: get('BACKEND_URL').required().asString(),
  DATABASE_URL: get('DATABASE_URL').required().asString(),
  JWT_SECRET: get('JWT_SECRET').required().asString(),

  CLOUDINARY_NAME: get('CLOUDINARY_NAME').required().asString(),
  CLOUDINARY_API_KEY: get('CLOUDINARY_API_KEY').required().asString(),
  CLOUDINARY_API_SECRET: get('CLOUDINARY_API_SECRET').required().asString(),

  STRIPE_SECRET_KEY: get('STRIPE_SECRET_KEY').required().asString(),
  STRIPE_ENDPOINT_SECRET: get('STRIPE_ENDPOINT_SECRET').required().asString(),
};
