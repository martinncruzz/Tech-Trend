import { Module, forwardRef } from '@nestjs/common';

import { PrismaModule } from 'src/database/prisma.module';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { CategoriesModule } from '../categories/categories.module';
import { SharedModule } from '../shared/shared.module';

@Module({
  imports: [PrismaModule, forwardRef(() => CategoriesModule), SharedModule],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
