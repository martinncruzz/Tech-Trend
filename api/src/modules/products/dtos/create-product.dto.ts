import { Type } from 'class-transformer';
import { IsInt, IsNumber, IsPositive, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  price: number;

  @IsInt()
  @IsPositive()
  @Type(() => Number)
  stock: number;

  @IsUUID()
  categoryId: string;

  imageId: string;

  imageUrl: string;
}
