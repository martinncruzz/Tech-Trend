import { IsOptional, IsString, MinLength, IsEnum } from 'class-validator';

import { PaginationDto, SortBy } from '..';

export class Filters extends PaginationDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;
}
