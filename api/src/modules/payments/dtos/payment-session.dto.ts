import { IsUUID } from 'class-validator';

export class PaymentSessionDto {
  @IsUUID()
  cartId: string;
}
