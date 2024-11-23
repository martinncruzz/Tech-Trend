import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUUID, Min, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  price: number;

  @IsNumber()
  @Min(1)
  @Type(() => Number)
  stock: number;

  @IsUUID()
  category_id: string;
}
