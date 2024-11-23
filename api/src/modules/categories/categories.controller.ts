import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseUUIDPipe } from '@nestjs/common';

import { CategoriesService } from './categories.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dtos';
import { Filters } from '../shared/dtos';
import { Auth } from '../auth/decorators';
import { ValidRoles } from '@prisma/client';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @Auth(ValidRoles.admin)
  createCategory(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.createCategory(createCategoryDto);
  }

  @Get()
  getAllCategories(@Query() params: Filters) {
    return this.categoriesService.getAllCategories(params);
  }

  @Get(':id')
  getCategoryById(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.getCategoryById(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  updateCategory(@Param('id', ParseUUIDPipe) id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoriesService.updateCategory(id, updateCategoryDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  deleteCategory(@Param('id', ParseUUIDPipe) id: string) {
    return this.categoriesService.deleteCategory(id);
  }
}
