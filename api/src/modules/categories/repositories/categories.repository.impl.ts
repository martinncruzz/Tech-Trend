import { Injectable } from '@nestjs/common';

import { CategoriesRepository } from '../../../modules/categories/repositories/categories.repository';
import { Category } from '../../../modules/categories/entities/category.entity';
import { CategoryFiltersDto } from '../../../modules/categories/dtos/category-filters.dto';
import { CreateCategoryDto } from '../../../modules/categories/dtos/create-category.dto';
import { PostgresDatabase } from '../../../database/postgres/postgres-database';
import { UpdateCategoryDto } from '../../../modules/categories/dtos/update-category.dto';

@Injectable()
export class CategoriesRepositoryImpl implements CategoriesRepository {
  private readonly prisma = PostgresDatabase.getClient();

  async findAll(categoryFiltersDto: CategoryFiltersDto): Promise<{ total: number; categories: Category[] }> {
    const { page, limit, name, sortBy, order } = categoryFiltersDto;
    const filters: Record<string, any> = {};

    if (name) filters.name = { contains: name, mode: 'insensitive' };

    const [total, categories] = await Promise.all([
      this.prisma.category.count({ where: filters }),
      this.prisma.category.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: order } : undefined,
        include: { products: true },
      }),
    ]);

    return { total, categories: categories.map(Category.fromObject) };
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({ where: { id }, include: { products: true } });
    return category ? Category.fromObject(category) : null;
  }

  async findByName(name: string): Promise<Category | null> {
    const category = await this.prisma.category.findFirst({ where: { name } });
    return category ? Category.fromObject(category) : null;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const createdCategory = await this.prisma.category.create({ data: createCategoryDto });
    return Category.fromObject(createdCategory);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const updatedCategory = await this.prisma.category.update({ where: { id }, data: updateCategoryDto });
    return Category.fromObject(updatedCategory);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.category.delete({ where: { id } });
    return true;
  }
}
