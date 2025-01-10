import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { buildBaseUrl } from '@modules/shared/helpers/base-url.builder';
import { buildFiltersQuery } from '@modules/shared/helpers/filters-query.builder';
import { buildPagination } from '@modules/shared/helpers/pagination.builder';
import { CategoriesRepository } from '@modules/categories/repositories/categories.repository';
import { Category } from '@modules/categories/entities/category.entity';
import { CategoryFiltersDto } from '@modules/categories/dtos/category-filters.dto';
import { CreateCategoryDto } from '@modules/categories/dtos/create-category.dto';
import { ProductsService } from '@modules/products/products.service';
import { ResourceType } from '@modules/shared/interfaces/enums';
import { UpdateCategoryDto } from '@modules/categories/dtos/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly categoriesRepository: CategoriesRepository,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async getCategories(
    categoryFiltersDto: CategoryFiltersDto,
  ): Promise<{ prev: string | null; next: string | null; categories: Category[] }> {
    const { total, categories } = await this.categoriesRepository.findAll(categoryFiltersDto);

    const filtersQuery = buildFiltersQuery(categoryFiltersDto);
    const baseUrl = buildBaseUrl(ResourceType.CATEGORIES);
    const { prev, next } = buildPagination(categoryFiltersDto, total, baseUrl, filtersQuery);

    return { prev, next, categories };
  }

  async getCategoryById(id: string): Promise<Category> {
    const category = await this.categoriesRepository.findById(id);

    if (!category) throw new NotFoundException(`Category with id "${id}" not found`);

    return category;
  }

  async createCategory(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const categoryExists = await this.categoriesRepository.findByName(createCategoryDto.name);

    if (categoryExists) {
      throw new BadRequestException(`Category with the name "${createCategoryDto.name}" already registered`);
    }

    return this.categoriesRepository.create(createCategoryDto);
  }

  async updateCategory(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.getCategoryById(id);

    if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
      const categoryExists = await this.categoriesRepository.findByName(updateCategoryDto.name);

      if (categoryExists) {
        throw new BadRequestException(`Category with the name "${updateCategoryDto.name}" already registered`);
      }
    }

    return this.categoriesRepository.update(id, updateCategoryDto);
  }

  async deleteCategory(id: string): Promise<boolean> {
    const category = await this.getCategoryById(id);

    if (!category.products || category.products.some((product) => !product.id)) {
      throw new InternalServerErrorException('Category data is incomplete');
    }

    if (category.products.length > 0) {
      await Promise.all(category.products.map((product) => this.productsService.deleteProduct(product.id!)));
    }

    return this.categoriesRepository.delete(id);
  }
}
