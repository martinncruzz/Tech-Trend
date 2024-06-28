import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';

import { Prisma } from '@prisma/client';

import {
  buildPaginationResponse,
  getBaseUrl,
  handleDBExceptions,
} from '../shared/helpers';
import { CreateProductDto, ProductFiltersDto, UpdateProductDto } from './dtos';
import { PrismaService } from 'src/database/prisma.service';
import { ResourceType } from '../shared/interfaces/pagination';
import { SortBy } from '../shared/interfaces/filters';
import { CategoriesService } from '../categories/categories.service';
import { UploaderService } from '../shared/services/uploader/uploader.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger('ProductsService');

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => CategoriesService))
    private readonly categoriesService: CategoriesService,
    private readonly uploaderService: UploaderService,
  ) {}

  async createProduct(
    createProductDto: CreateProductDto,
    file: Express.Multer.File,
  ) {
    if (!file)
      throw new BadRequestException(`Image is required to create a product`);
    await this.getProductByName(createProductDto.name);
    await this.categoriesService.getCategoryById(createProductDto.category_id);

    const fileUploaded = await this.uploaderService.uploadFile(file);

    try {
      const product = await this.prismaService.product.create({
        data: {
          ...createProductDto,
          image_url: fileUploaded.secure_url,
          image_id: fileUploaded.public_id,
        },
      });

      return product;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAllProducts(params: ProductFiltersDto) {
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

  async updateProduct(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ) {
    const currentProduct = await this.getProductById(id);

    if (updateProductDto.name && updateProductDto.name !== currentProduct.name)
      await this.getProductByName(updateProductDto.name);

    if (file) {
      const updatedFile = await this.uploaderService.updateFile(
        file,
        currentProduct.image_id,
      );

      updateProductDto.image_url = updatedFile.secure_url;
      updateProductDto.image_id = updatedFile.public_id;
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
    const product = await this.getProductById(id);
    await this.uploaderService.deleteFile(product.image_id);

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

    if (product)
      throw new BadRequestException(
        `Product with the name "${product.name}" already registered`,
      );

    return product;
  }

  private buildOrderBy(
    params: ProductFiltersDto,
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

  private buildWhere(params: ProductFiltersDto): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (params.search)
      where.name = { contains: params.search, mode: 'insensitive' };
    if (params.sortBy === SortBy.LAST_UPDATED) where.updatedAt = { not: null };
    if (params.status) where.stock = { gt: 0 };

    return where;
  }
}
