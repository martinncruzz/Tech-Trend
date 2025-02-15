import { InternalServerErrorException } from '@nestjs/common';

import { Cart } from '../../../modules/carts/entities/cart.entity';
import { CartItemSchema } from '../../../config/schemas/cart.schema';
import { Product } from '../../../modules/products/entities/product.entity';
import { ValidatorAdapter } from '../../../config/adapters/validator.adapter';

export class CartItem {
  constructor(
    public readonly id: string,
    public readonly cartId: string,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly subtotal: number,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly cart?: Partial<Cart>,
    public readonly product?: Partial<Product>,
  ) {}

  static fromObject(object: Record<string, any>): CartItem {
    const { success, data } = ValidatorAdapter.validate(object, CartItemSchema);

    if (!success) throw new InternalServerErrorException('Error processing cart item data');

    return new CartItem(
      data.id,
      data.cartId,
      data.productId,
      data.quantity,
      data.subtotal,
      data.createdAt,
      data.updatedAt,
      data.cart,
      data.product,
    );
  }
}
