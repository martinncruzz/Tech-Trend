import { IsNumber, IsUUID } from 'class-validator';

export class UpdateProductQuantityInCartDto {
  @IsUUID()
  product_id: string;

  @IsNumber()
  quantity: number;
}
