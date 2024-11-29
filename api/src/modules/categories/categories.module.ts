import { forwardRef, Module } from '@nestjs/common';

import { PrismaModule } from '../../database';
import { AuthModule } from '../auth';
import { ProductsModule } from '../products';
import { CategoriesController, CategoriesService } from '.';

@Module({
  imports: [PrismaModule, AuthModule, forwardRef(() => ProductsModule)],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService],
})
export class CategoriesModule {}
