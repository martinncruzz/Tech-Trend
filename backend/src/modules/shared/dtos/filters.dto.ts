import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { SortBy } from 'src/modules/products/interfaces';
import { PaginationDto } from './pagination.dto';

export class Filters extends PartialType(PaginationDto) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;
}
