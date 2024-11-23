import { PartialType } from '@nestjs/mapped-types';
import { IsOptional, IsString, MinLength, IsEnum } from 'class-validator';
import { PaginationDto } from './pagination.dto';
import { SortBy } from '../interfaces/filters';

export class Filters extends PartialType(PaginationDto) {
  @IsOptional()
  @IsString()
  @MinLength(1)
  search?: string;

  @IsOptional()
  @IsEnum(SortBy)
  sortBy?: SortBy;
}
