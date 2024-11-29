import { forwardRef, Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { AuthModule } from '../auth';
import { ShoppingCartsModule } from '../shopping-carts';
import { OrdersModule } from '../orders';
import { UsersController, UsersService } from '.';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), ShoppingCartsModule, OrdersModule],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
