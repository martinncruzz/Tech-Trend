import { Module } from '@nestjs/common';

import { AuthModule } from '../auth';
import { ProductsModule } from '../products';
import { ShoppingCartsModule } from '../shopping-carts';
import { OrdersModule } from '../orders';
import { PaymentsController, PaymentsService } from '.';

@Module({
  imports: [AuthModule, ProductsModule, ShoppingCartsModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
