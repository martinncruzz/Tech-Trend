import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';

import { Auth } from '@modules/auth/decorators/auth.decorator';
import { CategoriesService } from '@modules/categories/categories.service';
import { CategoryFiltersDto } from '@modules/categories/dtos/category-filters.dto';
import { CreateCategoryDto } from '@modules/categories/dtos/create-category.dto';
import { UpdateCategoryDto } from '@modules/categories/dtos/update-category.dto';
import { UserRoles } from '@modules/shared/interfaces/enums';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getCategories(@Query() categoryFiltersDto: CategoryFiltersDto) {
    return this.categoriesService.getCategories(categoryFiltersDto);
  }

  @Get(':id')
  getCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @Post()
  @Auth(UserRoles.ADMIN)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Patch(':id')
  @Auth(UserRoles.ADMIN)
  updateCategory(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @Auth(UserRoles.ADMIN)
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
