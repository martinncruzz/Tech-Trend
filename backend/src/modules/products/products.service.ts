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

  async getAllProducts(params: ProductFilters) {
    const { page = 1, limit = 10 } = params;

    this.validateFilters(params);

    const orderBy = this.buildOrderBy(params);
    const where = this.buildWhere(params);

    const [total, products] = await this.prismaService.$transaction([
      this.prismaService.product.count(),
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

  private validateFilters(params: ProductFilters): void {
    if (params.priceAsc && params.priceDesc)
      throw new BadRequestException(
        `It is not possible to filter by priceAsc and priceDesc at the same time`,
      );

    if (params.stockAsc && params.stockDesc)
      throw new BadRequestException(
        `It is not possible to filter by stockAsc and stockDesc at the same time`,
      );
  }

  private buildOrderBy(
    params: ProductFilters,
  ): Prisma.ProductOrderByWithAggregationInput[] {
    const orderBy: Prisma.ProductOrderByWithAggregationInput[] = [];

    if (params.updatedAt) orderBy.push({ updatedAt: 'desc' });
    if (params.priceAsc) orderBy.push({ price: 'asc' });
    if (params.priceDesc) orderBy.push({ price: 'desc' });
    if (params.stockAsc) orderBy.push({ stock: 'asc' });
    if (params.stockDesc) orderBy.push({ stock: 'desc' });

    if (orderBy.length === 0) orderBy.push({ createdAt: 'desc' });

    return orderBy;
  }

  private buildWhere(params: ProductFilters): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (params.name)
      where.name = { contains: params.name, mode: 'insensitive' };
    if (params.updatedAt) where.updatedAt = { not: null };

    return where;
  }
}
