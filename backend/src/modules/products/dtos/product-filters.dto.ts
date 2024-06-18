import { PartialType } from '@nestjs/mapped-types';

import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginationDto } from 'src/modules/shared/dtos';

export class ProductFilters extends PartialType(PaginationDto) {
  @IsString()
  @MinLength(1)
  @IsOptional()
  name?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  updatedAt?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  priceAsc?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  priceDesc?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  stockAsc?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  stockDesc?: boolean;
}
