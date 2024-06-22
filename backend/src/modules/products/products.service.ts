import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import {
  buildPaginationResponse,
  getBaseUrl,
  handleDBExceptions,
} from '../shared/helpers';
import { CreateProductDto, ProductFilters, UpdateProductDto } from './dtos';
import { PrismaService } from 'src/database/prisma.service';
import { ResourceType } from '../shared/interfaces/pagination';
import { SortBy } from './interfaces';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    const productExists = await this.getProductByName(createProductDto.name);

    if (productExists)
      throw new BadRequestException(
        `Product with the name "${createProductDto.name}" already registered`,
      );

    try {
      const product = await this.prismaService.product.create({
        data: createProductDto,
      });

      return product;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAllProducts(params: ProductFilters) {
    const { page = 1, limit = 10 } = params;

    const orderBy = this.buildOrderBy(params);
    const where = this.buildWhere(params);

    const [total, products] = await this.prismaService.$transaction([
      this.prismaService.product.count({ where }),
      this.prismaService.product.findMany({
        orderBy,
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const baseUrl = getBaseUrl(ResourceType.products);
    const paginationResponse = buildPaginationResponse({
      page,
      limit,
      total,
      baseUrl,
      items: products,
    });

    return paginationResponse;
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
    const currentProduct = await this.getProductById(id);

    if (updateProductDto.name !== currentProduct.name) {
      const productExists = await this.getProductByName(updateProductDto.name);

      if (productExists)
        throw new BadRequestException(
          `Product with the name "${updateProductDto.name}" already registered`,
        );
    }

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

  private async getProductByName(name: string) {
    const product = await this.prismaService.product.findUnique({
      where: { name },
    });

    return product;
  }

  private buildOrderBy(
    params: ProductFilters,
  ): Prisma.ProductOrderByWithAggregationInput {
    let orderBy: Prisma.ProductOrderByWithAggregationInput = {};

    switch (params.sortBy) {
      case SortBy.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
      case SortBy.OLDEST:
        orderBy = { createdAt: 'asc' };
        break;
      case SortBy.LAST_UPDATED:
        orderBy = { updatedAt: 'desc' };
        break;
      case SortBy.PRICE_ASC:
        orderBy = { price: 'asc' };
        break;
      case SortBy.PRICE_DESC:
        orderBy = { price: 'desc' };
        break;
      case SortBy.STOCK_ASC:
        orderBy = { stock: 'asc' };
        break;
      case SortBy.STOCK_DESC:
        orderBy = { stock: 'desc' };
        break;
    }

    return orderBy;
  }

  private buildWhere(params: ProductFilters): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (params.search)
      where.name = { contains: params.search, mode: 'insensitive' };
    if (params.sortBy === SortBy.LAST_UPDATED) where.updatedAt = { not: null };

    return where;
  }
}
