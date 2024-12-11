import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { ProductsModule } from '../products';
import { ShoppingCartsController, ShoppingCartsService } from '.';

@Module({
  imports: [PrismaModule, ProductsModule],
  controllers: [ShoppingCartsController],
  providers: [ShoppingCartsService],
  exports: [ShoppingCartsService],
})
export class ShoppingCartsModule {}
