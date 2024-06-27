import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import {
  buildPaginationResponse,
  getBaseUrl,
  handleDBExceptions,
} from '../shared/helpers';
import { Filters } from '../shared/dtos';
import { PrismaService } from 'src/database/prisma.service';
import { ResourceType } from '../shared/interfaces/pagination';
import { SortBy } from '../shared/interfaces/filters';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(private readonly prismaService: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    await this.getCategoryByName(createCategoryDto.name);

    try {
      const category = await this.prismaService.category.create({
        data: createCategoryDto,
      });

      return category;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAllCategories(params: Filters) {
    const { page = 1, limit = 10 } = params;

    const orderBy = this.buildOrderBy(params);
    const where = this.buildWhere(params);

    const [total, categories] = await this.prismaService.$transaction([
      this.prismaService.category.count({ where }),
      this.prismaService.category.findMany({
        orderBy,
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const baseUrl = getBaseUrl(ResourceType.categories);
    const paginationResponse = buildPaginationResponse({
      page,
      limit,
      total,
      baseUrl,
      items: categories,
    });

    return paginationResponse;
  }

  async getCategoryById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { category_id: id },
      include: { products: true },
    });

    if (!category)
      throw new NotFoundException(`Category with id "${id}" not found`);

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    const currentCategory = await this.getCategoryById(id);

    if (updateCategoryDto.name !== currentCategory.name)
      await this.getCategoryByName(updateCategoryDto.name);

    try {
      const category = await this.prismaService.category.update({
        where: { category_id: id },
        data: {
          ...updateCategoryDto,
          updatedAt: new Date(),
        },
      });

      return category;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async deleteCategory(id: string) {
    await this.getCategoryById(id);

    try {
      await this.prismaService.category.delete({
        where: { category_id: id },
      });

      return true;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  private async getCategoryByName(name: string) {
    const category = await this.prismaService.category.findUnique({
      where: { name },
    });

    if (category)
      throw new BadRequestException(
        `Category with the name "${name}" already registered`,
      );

    return category;
  }

  private buildOrderBy(
    params: Filters,
  ): Prisma.CategoryOrderByWithAggregationInput {
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

    if (params.search)
      where.name = { contains: params.search, mode: 'insensitive' };
    if (params.sortBy === SortBy.LAST_UPDATED) where.updatedAt = { not: null };

    return where;
  }
}
