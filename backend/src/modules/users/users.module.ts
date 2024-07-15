import { forwardRef, Module } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth/auth.module';
import { ShoppingCartsModule } from '../shopping-carts/shopping-carts.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [
    PrismaModule,
    ShoppingCartsModule,
    OrdersModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
