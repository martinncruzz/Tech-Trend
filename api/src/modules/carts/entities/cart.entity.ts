import { InternalServerErrorException } from '@nestjs/common';

import { CartItem } from '@modules/carts/entities/cart-item.entity';
import { CartSchema } from '@config/schemas/cart.schema';
import { User } from '@modules/users/entities/user.entity';
import { ValidatorAdapter } from '@config/adapters/validator.adapter';

export class Cart {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly total: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly user?: Partial<User>,
    public readonly items?: Partial<CartItem>[],
  ) {}

  static fromObject(object: Record<string, any>): Cart {
    const { success, data } = ValidatorAdapter.validate(object, CartSchema);

    if (!success) throw new InternalServerErrorException('Error processing cart data');

    return new Cart(data.id, data.userId, data.total, data.createdAt, data.updatedAt, data.user, data.items);
  }
}
