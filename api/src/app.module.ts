import { Module } from '@nestjs/common';

import { AuthModule } from '@modules/auth/auth.module';
import { CartsModule } from '@modules/carts/carts.module';
import { CategoriesModule } from '@modules/categories/categories.module';
import { OrdersModule } from '@modules/orders/orders.module';
import { PaymentsModule } from '@modules/payments/payments.module';
import { ProductsModule } from '@modules/products/products.module';
import { SharedModule } from '@modules/shared/shared.module';
import { UsersModule } from '@modules/users/users.module';

@Module({
  imports: [
    SharedModule,
    UsersModule,
    AuthModule,
    CartsModule,
    ProductsModule,
    CategoriesModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
