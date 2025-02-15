import { forwardRef, Module } from '@nestjs/common';

import { CartsModule } from '../../modules/carts/carts.module';
import { CategoriesModule } from '../../modules/categories/categories.module';
import { OrdersModule } from '../../modules/orders/orders.module';
import { ProductsController } from '../../modules/products/products.controller';
import { ProductsRepository } from '../../modules/products/repositories/products.repository';
import { ProductsRepositoryImpl } from '../../modules/products/repositories/products.repository.impl';
import { ProductsService } from '../../modules/products/products.service';
import { SharedModule } from '../../modules/shared/shared.module';

@Module({
  imports: [SharedModule, forwardRef(() => CategoriesModule), forwardRef(() => CartsModule), OrdersModule],
  controllers: [ProductsController],
  providers: [ProductsService, { provide: ProductsRepository, useClass: ProductsRepositoryImpl }],
  exports: [ProductsService, ProductsRepository],
})
export class ProductsModule {}
