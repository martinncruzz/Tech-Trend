import { Module } from '@nestjs/common';
import { UploaderModule } from './services/uploader/uploader.module';

@Module({
  imports: [UploaderModule],
  exports: [UploaderModule],
})
export class SharedModule {}
