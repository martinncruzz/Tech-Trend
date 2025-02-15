import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import * as streamifier from 'streamifier';

import { FOLDER_NAME } from '../../../../modules/shared/services/uploader/cloudinary/cloudinary.constants';
import { MediaOptimizerAdapter } from '../../../../config/adapters/media-optimizer.adapter';

@Injectable()
export class UploaderService {
  async uploadFile(file: Express.Multer.File): Promise<UploadApiResponse | UploadApiErrorResponse> {
    const optimizedBuffer = await MediaOptimizerAdapter.optimizeImage(file);

    return new Promise<UploadApiResponse | UploadApiErrorResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: FOLDER_NAME }, (error, result) => {
        if (error) return reject(new InternalServerErrorException('Error uploading image to Cloudinary'));
        resolve(result!);
      });

      streamifier.createReadStream(optimizedBuffer).pipe(uploadStream);
    });
  }

  async deleteFile(imageId: string): Promise<void> {
    const response = await cloudinary.uploader.destroy(imageId);
    if (response.result !== 'ok') throw new InternalServerErrorException('Error deleting image from Cloudinary');
  }

  async updateFile(file: Express.Multer.File, imageId: string): Promise<UploadApiResponse | UploadApiErrorResponse> {
    await this.deleteFile(imageId);
    return this.uploadFile(file);
  }
}
