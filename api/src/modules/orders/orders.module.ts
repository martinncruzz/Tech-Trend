import { Module } from '@nestjs/common';

import { OrderItemsRepository } from '../../modules/orders/repositories/order-items.repository';
import { OrderItemsRepositoryImpl } from '../../modules/orders/repositories/order-items.repository.impl';
import { OrdersController } from '../../modules/orders/orders.controller';
import { OrdersRepository } from '../../modules/orders/repositories/orders.repository';
import { OrdersRepositoryImpl } from '../../modules/orders/repositories/orders.repository.impl';
import { OrdersService } from '../../modules/orders/orders.service';

@Module({
  imports: [],
  controllers: [OrdersController],
  providers: [
    OrdersService,
    { provide: OrdersRepository, useClass: OrdersRepositoryImpl },
    { provide: OrderItemsRepository, useClass: OrderItemsRepositoryImpl },
  ],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
