import { Type } from 'class-transformer';
import { IsEnum, IsOptional, IsPositive, Validate } from 'class-validator';

import { OrderStatus } from '@modules/shared/interfaces/enums';
import { PaginationDto } from '@modules/shared/dtos/pagination.dto';
import { SortByOrderConstraint } from '@config/constraints/sort-by-order.constraint';
import { TotalRangeConstraint } from '@config/constraints/total-range.constraint';

export class OrderFiltersDto extends PaginationDto {
  @IsOptional()
  @IsEnum(OrderStatus)
  status?: OrderStatus;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  minTotal?: number;

  @IsOptional()
  @Type(() => Number)
  @IsPositive()
  @Validate(TotalRangeConstraint)
  maxTotal?: number;

  @IsOptional()
  @IsEnum(['total', 'status', 'createdAt', 'updatedAt'])
  @Validate(SortByOrderConstraint)
  sortBy?: 'total' | 'status' | 'createdAt' | 'updatedAt';

  @IsOptional()
  @IsEnum(['asc', 'desc'])
  @Validate(SortByOrderConstraint)
  order?: 'asc' | 'desc';
}
