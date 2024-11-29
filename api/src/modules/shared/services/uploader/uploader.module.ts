import { Module } from '@nestjs/common';

import { CloudinaryProvider, UploaderService } from '../..';

@Module({
  providers: [UploaderService, CloudinaryProvider],
  exports: [UploaderService],
})
export class UploaderModule {}
