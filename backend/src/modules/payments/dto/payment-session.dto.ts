import { IsUUID } from 'class-validator';

export class PaymentSessionDto {
  @IsUUID()
  shopping_cart_id: string;
}
