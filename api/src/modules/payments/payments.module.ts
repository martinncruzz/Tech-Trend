import { Module } from '@nestjs/common';

import { CartsModule } from '@modules/carts/carts.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { PaymentsController } from '@modules/payments/payments.controller';
import { PaymentsService } from '@modules/payments/payments.service';
import { ProductsModule } from '@modules/products/products.module';

@Module({
  imports: [ProductsModule, CartsModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
