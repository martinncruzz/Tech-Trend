import { Module } from '@nestjs/common';

import { UploaderModule } from '../../modules/shared/services/uploader/uploader.module';

@Module({
  imports: [UploaderModule],
  exports: [UploaderModule],
})
export class SharedModule {}
