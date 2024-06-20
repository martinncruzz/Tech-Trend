import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { PaginationDto } from 'src/modules/shared/dtos';
import { SortBy } from '../interfaces';

export class ProductFilters extends PartialType(PaginationDto) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;
}
