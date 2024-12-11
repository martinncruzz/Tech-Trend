import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { OrdersController, OrdersService } from '.';

@Module({
  imports: [PrismaModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
