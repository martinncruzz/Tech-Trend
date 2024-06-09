import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { handleDBExceptions } from '../shared/helpers';
import { PaginationDto } from '../shared/dtos';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger('CategoriesService');

  constructor(private readonly prismaService: PrismaService) {}

  async createCategory(createCategoryDto: CreateCategoryDto) {
    try {
      const category = await this.prismaService.category.create({
        data: createCategoryDto,
      });

      return category;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAllCategories(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const categories = await this.prismaService.category.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return categories;
  }

  async getCategoryById(id: string) {
    const category = await this.prismaService.category.findUnique({
      where: { category_id: id },
    });

    if (!category)
      throw new NotFoundException(`Category with id "${id}" not found`);

    return category;
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.getCategoryById(id);

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
}
