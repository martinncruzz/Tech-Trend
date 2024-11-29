import { Module } from '@nestjs/common';

import { PrismaModule } from './database';
import {
  SharedModule,
  UsersModule,
  AuthModule,
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
    UsersModule,
    AuthModule,
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
