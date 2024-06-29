import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsEnum, IsUUID } from 'class-validator';
import { Filters } from 'src/modules/shared/dtos';
import { ProductFilters } from '../interfaces';

export class ProductFiltersDto extends PartialType(Filters) {
  @IsOptional()
  @IsEnum(ProductFilters)
  status?: ProductFilters;

  @IsOptional()
  @IsUUID()
  categoryId: string;
}
