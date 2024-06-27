import 'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
  PORT: number;

  FRONTEND_URL: string;
  BACKEND_URL: string;

  DATABASE_URL: string;

  JWT_SECRET: string;

  CLOUDINARY_NAME: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
}

const envsSchema = joi
  .object({
    PORT: joi.number().required(),

    FRONTEND_URL: joi.string().required(),
    BACKEND_URL: joi.string().required(),

    DATABASE_URL: joi.string().required(),

    JWT_SECRET: joi.string().required(),

    CLOUDINARY_NAME: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) throw new Error(`Config validation error: ${error.message}`);

const envVars: EnvVars = value;

export const envs = {
  PORT: envVars.PORT,

  FRONTEND_URL: envVars.FRONTEND_URL,
  BACKEND_URL: envVars.BACKEND_URL,

  DATABASE_URL: envVars.DATABASE_URL,

  JWT_SECRET: envVars.JWT_SECRET,

  CLOUDINARY_NAME: envVars.CLOUDINARY_NAME,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
};
