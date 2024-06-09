import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateProductDto, UpdateProductDto } from './dtos';
import { handleDBExceptions } from '../shared/helpers';
import { PaginationDto } from '../shared/dtos';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    try {
      const product = await this.prismaService.product.create({
        data: createProductDto,
      });

      return product;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAllProducts(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const products = await this.prismaService.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return products;
  }

  async getProductById(id: string) {
    const product = await this.prismaService.product.findUnique({
      where: { product_id: id },
    });

    if (!product)
      throw new NotFoundException(`Product with id "${id}" not found`);

    return product;
  }

  async updateProduct(id: string, updateProductDto: UpdateProductDto) {
    await this.getProductById(id);

    try {
      const product = await this.prismaService.product.update({
        where: { product_id: id },
        data: { ...updateProductDto, updatedAt: new Date() },
      });

      return product;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async deleteProduct(id: string) {
    await this.getProductById(id);

    try {
      await this.prismaService.product.delete({
        where: { product_id: id },
      });

      return true;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }
}
