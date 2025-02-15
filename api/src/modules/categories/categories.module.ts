import { forwardRef, Module } from '@nestjs/common';

import { CategoriesController } from '../../modules/categories/categories.controller';
import { CategoriesRepository } from '../../modules/categories/repositories/categories.repository';
import { CategoriesRepositoryImpl } from '../../modules/categories/repositories/categories.repository.impl';
import { CategoriesService } from '../../modules/categories/categories.service';
import { ProductsModule } from '../../modules/products/products.module';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  controllers: [CategoriesController],
  providers: [CategoriesService, { provide: CategoriesRepository, useClass: CategoriesRepositoryImpl }],
  exports: [CategoriesService, CategoriesRepository],
})
export class CategoriesModule {}
