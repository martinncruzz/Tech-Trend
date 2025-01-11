import { InternalServerErrorException } from '@nestjs/common';

import { CartItem } from '@modules/carts/entities/cart-item.entity';
import { Category } from '@modules/categories/entities/category.entity';
import { OrderItem } from '@modules/orders/entities/order-item.entity';
import { ProductSchema } from '@config/schemas/product.schema';
import { ValidatorAdapter } from '@config/adapters/validator.adapter';

export class Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly stock: number,
    public readonly imageId: string,
    public readonly imageUrl: string,
    public readonly categoryId: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly category?: Partial<Category>,
    public readonly cartItems?: Partial<CartItem>[],
    public readonly orderItems?: Partial<OrderItem>[],
  ) {}

  static fromObject(object: Record<string, any>): Product {
    const { success, data } = ValidatorAdapter.validate(object, ProductSchema);

    if (!success) throw new InternalServerErrorException('Error processing product data');

    return new Product(
      data.id,
      data.name,
      data.description,
      data.price,
      data.stock,
      data.imageId,
      data.imageUrl,
      data.categoryId,
      data.createdAt,
      data.updatedAt,
      data.category,
      data.cartItems,
    );
  }
}
