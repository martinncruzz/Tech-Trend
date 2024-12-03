import { IsOptional, IsEnum, IsUUID } from 'class-validator';

import { Filters } from '../../shared';
import { ProductFilters } from '..';

export class ProductFiltersDto extends Filters {
  @IsOptional()
  @IsEnum(ProductFilters)
  status?: ProductFilters;

  @IsOptional()
  @IsUUID()
  categoryId: string;
}
