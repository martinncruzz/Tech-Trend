import { Category } from '@modules/categories/entities/category.entity';
import { CategoryFiltersDto } from '@modules/categories/dtos/category-filters.dto';
import { CreateCategoryDto } from '@modules/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from '@modules/categories/dtos/update-category.dto';

export abstract class CategoriesRepository {
  abstract findAll(categoryFiltersDto: CategoryFiltersDto): Promise<{ total: number; categories: Category[] }>;
  abstract findById(id: string): Promise<Category | null>;
  abstract findByName(name: string): Promise<Category | null>;
  abstract create(createCategoryDto: CreateCategoryDto): Promise<Category>;
  abstract update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category>;
  abstract delete(id: string): Promise<boolean>;
}
