import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { AuthModule } from '../auth';
import { OrdersController, OrdersService } from '.';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService],
})
export class OrdersModule {}
