import { Module } from '@nestjs/common';
import { PrismaModule } from './database/prisma.module';
import { SharedModule } from './modules/shared/shared.module';
import { UsersModule } from './modules/users/users.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ShoppingCartsModule } from './modules/shopping-carts/shopping-carts.module';
import { AuthModule } from './modules/auth/auth.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [PrismaModule, SharedModule, UsersModule, ProductsModule, CategoriesModule, ShoppingCartsModule, AuthModule, OrdersModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
