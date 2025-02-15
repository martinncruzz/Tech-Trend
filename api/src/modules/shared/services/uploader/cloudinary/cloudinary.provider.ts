import { v2 as cloudinary } from 'cloudinary';

import { CLOUDINARY } from '../../../../../modules/shared/services/uploader/cloudinary/cloudinary.constants';
import { envs } from '../../../../../config/adapters/envs.adapter';

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
