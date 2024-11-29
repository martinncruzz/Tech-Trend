import { forwardRef, Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { SharedModule } from '../shared';
import { AuthModule } from '../auth';
import { CategoriesModule } from '../categories';
import { ProductsController, ProductsService } from '.';

@Module({
  imports: [PrismaModule, SharedModule, AuthModule, forwardRef(() => CategoriesModule)],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
