import { v2 as cloudinary } from 'cloudinary';
import { envs } from 'src/config';
import { CLOUDINARY } from './interfaces';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return cloudinary.config({
      cloud_name: envs.CLOUDINARY_NAME,
      api_key: envs.CLOUDINARY_API_KEY,
      api_secret: envs.CLOUDINARY_API_SECRET,
    });
  },
};
