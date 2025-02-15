import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, IsString, IsUUID, MinLength, Validate } from 'class-validator';

import { PaginationDto } from '../../../modules/shared/dtos/pagination.dto';
import { PriceRangeConstraint } from '../../../config/constraints/price-range.constraint';
import { SortByOrderConstraint } from '../../../config/constraints/sort-by-order.constraint';

export class ProductFiltersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Validate(PriceRangeConstraint)
  maxPrice?: number;

  @IsOptional()
  @IsUUID()
  categoryId?: string;

  @IsOptional()
  @IsEnum(['true', 'false'])
  inStock?: 'true' | 'false';

  @IsOptional()
  @IsEnum(['name', 'price', 'stock', 'createdAt', 'updatedAt'])
  @Validate(SortByOrderConstraint)
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Validate(SortByOrderConstraint)
  order?: 'asc' | 'desc';
}
