import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { PrismaService } from '../../database';
import { buildBaseUrl, buildPagination, Filters, ResourceType, SortBy } from '../shared';
import { ProductsService } from '../products';
import { CreateCategoryDto, UpdateCategoryDto } from '.';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly prismaService: PrismaService,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    await this.getCategoryByName(createCategoryDto.name);

    const category = await this.prismaService.category.create({ data: createCategoryDto });

    return category;
  }

  async getAllCategories(params: Filters) {
    const { page, limit } = params;

    const orderBy = this.buildOrderBy(params);
    const where = this.buildWhere(params);

    const [total, categories] = await this.prismaService.$transaction([
      this.prismaService.category.count({ where }),
      this.prismaService.category.findMany({
        orderBy,
        where,
        skip: (page - 1) * limit,
        take: limit,
        include: { products: true },
      }),
    ]);

    const baseUrl = buildBaseUrl(ResourceType.categories);
    const { prev, next } = buildPagination({ page, limit }, total, baseUrl);

    return { prev, next, categories };
  }

  async getCategoryById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { category_id: id },
      include: { products: true },
    });

    if (!category) throw new NotFoundException(`Category with id "${id}" not found`);

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const currentCategory = await this.getCategoryById(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== currentCategory.name)
      await this.getCategoryByName(updateCategoryDto.name);

    const category = await this.prismaService.category.update({
      where: { category_id: id },
      data: { ...updateCategoryDto, updatedAt: new Date() },
    });

    return category;
  }

  async deleteCategory(id: string) {
    const category = await this.getCategoryById(id);

    if (category.products.length > 0) {
      await Promise.all(category.products.map((product) => this.productsService.deleteProduct(product.product_id)));
    }

    await this.prismaService.category.delete({ where: { category_id: id } });

    return true;
  }

  private async getCategoryByName(name: string) {
    const category = await this.prismaService.category.findUnique({ where: { name } });

    if (category) throw new BadRequestException(`Category with the name "${name}" already registered`);

    return category;
  }

  private buildOrderBy(params: Filters): Prisma.CategoryOrderByWithAggregationInput {
    let orderBy: Prisma.CategoryOrderByWithAggregationInput = {};

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
    }

    return orderBy;
  }

  private buildWhere(params: Filters): Prisma.CategoryWhereInput {
    const where: Prisma.CategoryWhereInput = {};

    if (params.search) where.name = { contains: params.search, mode: 'insensitive' };
    if (params.sortBy === SortBy.LAST_UPDATED) where.updatedAt = { not: null };

    return where;
  }
}
