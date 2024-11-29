import { forwardRef, Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { AuthModule } from '../auth';
import { ProductsModule } from '../products';
import { ShoppingCartsController, ShoppingCartsService } from '.';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), ProductsModule],
  controllers: [ShoppingCartsController],
  providers: [ShoppingCartsService],
  exports: [ShoppingCartsService],
})
export class ShoppingCartsModule {}
