import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { ShoppingCartsModule } from '../shopping-carts';
import { OrdersModule } from '../orders';
import { UsersController, UsersService } from '.';

@Module({
  imports: [PrismaModule, ShoppingCartsModule, OrdersModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
