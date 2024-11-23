import { Module } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';
import { ShoppingCartsModule } from '../shopping-carts/shopping-carts.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [AuthModule, ProductsModule, ShoppingCartsModule, OrdersModule],
  controllers: [PaymentsController],
  providers: [PaymentsService],
})
export class PaymentsModule {}
