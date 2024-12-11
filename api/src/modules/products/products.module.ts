import { forwardRef, Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { SharedModule } from '../shared';
import { CategoriesModule } from '../categories';
import { ProductsController, ProductsService } from '.';

@Module({
  imports: [PrismaModule, SharedModule, forwardRef(() => CategoriesModule)],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
