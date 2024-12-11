import { forwardRef, Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { ProductsModule } from '../products';
import { CategoriesController, CategoriesService } from '.';

@Module({
  imports: [PrismaModule, forwardRef(() => ProductsModule)],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
