import { Module } from '@nestjs/common';

import { UploaderModule } from '.';

@Module({
  imports: [UploaderModule],
  exports: [UploaderModule],
})
export class SharedModule {}
