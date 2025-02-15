import { forwardRef, Module } from '@nestjs/common';

import { CartItemsRepository } from '../../modules/carts/repositories/cart-items.repository';
import { CartItemsRepositoryImpl } from '../../modules/carts/repositories/cart-items.repository.impl';
import { CartsController } from '../../modules/carts/carts.controller';
import { CartsRepository } from '../../modules/carts/repositories/carts.repository';
import { CartsRepositoryImpl } from '../../modules/carts/repositories/carts.repository.impl';
import { CartsService } from '../../modules/carts/carts.service';
import { ProductsModule } from '../../modules/products/products.module';

@Module({
  imports: [forwardRef(() => ProductsModule)],
  controllers: [CartsController],
  providers: [
    CartsService,
    { provide: CartsRepository, useClass: CartsRepositoryImpl },
    { provide: CartItemsRepository, useClass: CartItemsRepositoryImpl },
  ],
  exports: [CartsService, CartsRepository, CartItemsRepository],
})
export class CartsModule {}
