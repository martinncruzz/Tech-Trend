import { IsNumber, IsUUID, Min } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  user_id: string;

  @IsNumber()
  @Min(1)
  total: number;
}
