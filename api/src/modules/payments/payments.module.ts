import { Module } from '@nestjs/common';

import { ProductsModule } from '../products';
import { ShoppingCartsModule } from '../shopping-carts';
import { OrdersModule } from '../orders';
import { PaymentsController, PaymentsService } from '.';

@Module({
  imports: [ProductsModule, ShoppingCartsModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
