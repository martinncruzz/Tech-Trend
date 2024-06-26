import {
  IsNumber,
  IsPositive,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(5)
  name: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsNumber()
  @Min(1)
  @IsPositive()
  price: number;

  @IsNumber()
  @Min(1)
  @IsPositive()
  stock: number;

  @IsString()
  @MinLength(1)
  @IsUUID()
  category_id: string;
}
