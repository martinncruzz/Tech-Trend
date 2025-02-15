import { InternalServerErrorException } from '@nestjs/common';

import { Order } from '../../../modules/orders/entities/order.entity';
import { OrderItemSchema } from '../../../config/schemas/order.schema';
import { Product } from '../../../modules/products/entities/product.entity';
import { ValidatorAdapter } from '../../../config/adapters/validator.adapter';

export class OrderItem {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly subtotal: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly order?: Partial<Order>,
    public readonly product?: Partial<Product>,
  ) {}

  static fromObject(object: Record<string, any>): OrderItem {
    const { success, data } = ValidatorAdapter.validate(object, OrderItemSchema);

    if (!success) throw new InternalServerErrorException('Error processing order item data');

    return new OrderItem(
      data.id,
      data.orderId,
      data.productId,
      data.quantity,
      data.subtotal,
      data.createdAt,
      data.updatedAt,
      data.order,
      data.product,
    );
  }
}
