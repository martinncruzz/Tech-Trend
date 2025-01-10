import { IsEnum, IsOptional, IsString, MinLength, Validate } from 'class-validator';

import { PaginationDto } from '@modules/shared/dtos/pagination.dto';
import { SortByOrderConstraint } from '@config/constraints/sort-by-order.constraint';

export class CategoryFiltersDto extends PaginationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsOptional()
  @IsEnum(['name', 'createdAt', 'updatedAt'])
  @Validate(SortByOrderConstraint)
  sortBy?: 'name' | 'createdAt' | 'updatedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Validate(SortByOrderConstraint)
  order?: 'asc' | 'desc';
}
