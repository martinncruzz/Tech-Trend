import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

import { MediaOptimizerAdapter } from '../../../../config';
import { CloudinaryResponse, FOLDER_NAME } from '../..';

@Injectable()
export class UploaderService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    const optimizedBuffer = await MediaOptimizerAdapter.optimizeImage(file);

    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream({ folder: FOLDER_NAME }, (error, result) => {
        if (error) return reject(new InternalServerErrorException('Error uploading image to Cloudinary'));
        resolve(result!);
      });

      streamifier.createReadStream(optimizedBuffer).pipe(uploadStream);
    });
  }

  async deleteFile(image_id: string): Promise<void> {
    const response = await cloudinary.uploader.destroy(image_id);
    if (response.result !== 'ok') throw new InternalServerErrorException('Error deleting image from Cloudinary');
  }

  async updateFile(file: Express.Multer.File, image_id: string): Promise<CloudinaryResponse> {
    await this.deleteFile(image_id);

    const updatedFile = await this.uploadFile(file);

    return updatedFile;
  }
}
