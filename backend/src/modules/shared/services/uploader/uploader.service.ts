import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

import { v2 as cloudinary } from 'cloudinary';
import * as streamifier from 'streamifier';

import { CloudinaryResponse, FOLDER_NAME } from './cloudinary/interfaces';
import { SharpAdapter } from '../../../../config';

@Injectable()
export class UploaderService {
  private readonly logger = new Logger('UploaderService');

  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    const optimizedBuffer = await SharpAdapter.optimizeImage(file);

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: FOLDER_NAME }, (error, result) => {
        if (error) {
          this.logger.error(error.message);
          return reject(new InternalServerErrorException('Error uploading image to Cloudinary'));
        }
        resolve(result);
      });

      streamifier.createReadStream(optimizedBuffer).pipe(uploadStream);
    });
  }

  async deleteFile(image_id: string): Promise<void> {
    try {
      const response = await cloudinary.uploader.destroy(image_id);
      if (response.result !== 'ok') throw new InternalServerErrorException('Error deleting image from Cloudinary');
    } catch (error) {
      this.logger.error(error);
      throw error;
    }
  }

  async updateFile(file: Express.Multer.File, image_id: string): Promise<CloudinaryResponse> {
    await this.deleteFile(image_id);
    const updatedFile = await this.uploadFile(file);

    return updatedFile;
  }
}
