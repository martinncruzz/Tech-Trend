import { InternalServerErrorException } from '@nestjs/common';

import { OrderItem } from '@modules/orders/entities/order-item.entity';
import { OrderSchema } from '@config/schemas/order.schema';
import { OrderStatus } from '@modules/shared/interfaces/enums';
import { User } from '@modules/users/entities/user.entity';
import { ValidatorAdapter } from '@config/adapters/validator.adapter';

export class Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly total: number,
    public readonly status: OrderStatus,
    public readonly receiptUrl: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly user?: Partial<User>,
    public readonly items?: Partial<OrderItem>[],
  ) {}

  static fromObject(object: Record<string, any>): Order {
    const { success, data } = ValidatorAdapter.validate(object, OrderSchema);

    if (!success) throw new InternalServerErrorException('Error processing order data');

    return new Order(
      data.id,
      data.userId,
      data.total,
      data.status,
      data.receiptUrl,
      data.createdAt,
      data.updatedAt,
      data.user,
      data.items,
    );
  }
}
