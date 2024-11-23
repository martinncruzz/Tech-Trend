import { IsNumber, IsUUID, Min } from 'class-validator';

export class AddProductToCartDto {
  @IsUUID()
  product_id: string;

  @IsNumber()
  @Min(1)
  quantity: number;
}
