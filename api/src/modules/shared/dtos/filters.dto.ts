import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength, IsEnum } from 'class-validator';

import { PaginationDto, SortBy } from '..';

export class Filters extends PartialType(PaginationDto) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;
}
