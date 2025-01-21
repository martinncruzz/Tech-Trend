import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Auth } from '@modules/auth/decorators/auth.decorator';
import { CreateProductDto } from '@modules/products/dtos/create-product.dto';
import { fileFilter } from '@modules/shared/helpers/file-filter.helper';
import { ProductFiltersDto } from '@modules/products/dtos/product-filters.dto';
import { ProductsService } from '@modules/products/products.service';
import { UpdateProductDto } from '@modules/products/dtos/update-product.dto';
import { UserRoles } from '@modules/shared/interfaces/enums';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getProducts(@Query() productFiltersDto: ProductFiltersDto) {
    return this.productsService.getProducts(productFiltersDto);
  }

  @Get(':id')
  getProductById(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.getProductById(id);
  }

  @Post()
  @Auth({ roles: [UserRoles.ADMIN] })
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  createProduct(@Body() createProductDto: CreateProductDto, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('File is required to create a product');
    return this.productsService.createProduct(createProductDto, file);
  }

  @Patch(':id')
  @Auth({ roles: [UserRoles.ADMIN] })
  @UseInterceptors(FileInterceptor('file', { fileFilter: fileFilter }))
  updateProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.productsService.updateProduct(id, updateProductDto, file);
  }

  @Delete(':id')
  @Auth({ roles: [UserRoles.ADMIN] })
  deleteProduct(@Param('id', ParseUUIDPipe) id: string) {
    return this.productsService.deleteProduct(id);
  }
}
