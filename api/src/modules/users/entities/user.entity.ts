import { InternalServerErrorException } from '@nestjs/common';

import { Cart } from '@modules/carts/entities/cart.entity';
import { Order } from '@modules/orders/entities/order.entity';
import { UserRoles } from '@modules/shared/interfaces/enums';
import { UserSchema } from '@config/schemas/user.schema';
import { ValidatorAdapter } from '@config/adapters/validator.adapter';

export class User {
  constructor(
    public readonly id: string,
    public readonly fullname: string,
    public readonly email: string,
    public readonly password: string,
    public readonly roles: UserRoles[],
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly cart?: Partial<Cart>,
    public readonly orders?: Partial<Order>[],
  ) {}

  static fromObject(object: Record<string, any>): User {
    const { success, data } = ValidatorAdapter.validate(object, UserSchema);

    if (!success) throw new InternalServerErrorException('Error processing user data');

    return new User(
      data.id,
      data.fullname,
      data.email,
      data.password,
      data.roles,
      data.createdAt,
      data.updatedAt,
      data.cart,
    );
  }
}
