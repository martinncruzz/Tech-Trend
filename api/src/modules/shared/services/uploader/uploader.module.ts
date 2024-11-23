import { Module } from '@nestjs/common';
import { UploaderService } from './uploader.service';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';

@Module({
  providers: [CloudinaryProvider, UploaderService],
  exports: [UploaderService],
})
export class UploaderModule {}
