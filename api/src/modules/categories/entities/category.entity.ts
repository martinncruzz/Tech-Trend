import { InternalServerErrorException } from '@nestjs/common';

import { CategorySchema } from '@config/schemas/category.schema';
import { Product } from '@modules/products/entities/product.entity';
import { ValidatorAdapter } from '@config/adapters/validator.adapter';

export class Category {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly description: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly products?: Partial<Product>[],
  ) {}

  static fromObject(object: Record<string, any>): Category {
    const { success, data } = ValidatorAdapter.validate(object, CategorySchema);

    if (!success) throw new InternalServerErrorException('Error processing category data');

    return new Category(data.id, data.name, data.description, data.createdAt, data.updatedAt, data.products);
  }
}
