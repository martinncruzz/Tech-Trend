import { IsUUID, IsInt, IsPositive } from 'class-validator';

export class CartItemDto {
  @IsUUID()
  productId: string;

  @IsInt()
  @IsPositive()
  quantity: number;
}
