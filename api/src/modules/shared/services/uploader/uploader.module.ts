import { Module } from '@nestjs/common';

import { CloudinaryProvider } from '@modules/shared/services/uploader/cloudinary/cloudinary.provider';
import { UploaderService } from '@modules/shared/services/uploader/uploader.service';

@Module({
  providers: [UploaderService, CloudinaryProvider],
  exports: [UploaderService],
})
export class UploaderModule {}
