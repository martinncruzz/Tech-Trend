import { Module } from '@nestjs/common';

import { PrismaModule } from './database';
import {
  SharedModule,
  AuthModule,
  UsersModule,
  ProductsModule,
  CategoriesModule,
  ShoppingCartsModule,
  OrdersModule,
  PaymentsModule,
} from './modules';

@Module({
  imports: [
    PrismaModule,
    SharedModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    CategoriesModule,
    ShoppingCartsModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
