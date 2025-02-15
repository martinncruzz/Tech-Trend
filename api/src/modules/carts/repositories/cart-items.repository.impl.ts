import { Injectable } from '@nestjs/common';

import { CartItem } from '../../../modules/carts/entities/cart-item.entity';
import { CartItemsRepository } from '../../../modules/carts/repositories/cart-items.repository';
import { CreateCartItemDto } from '../../../modules/carts/dtos/create-cart-item.dto';
import { PostgresDatabase } from '../../../database/postgres/postgres-database';
import { UpdateCartItemDto } from '../../../modules/carts/dtos/update-cart-item.dto';

@Injectable()
export class CartItemsRepositoryImpl implements CartItemsRepository {
  private readonly prisma = PostgresDatabase.getClient();

  async findAllByProductId(productId: string): Promise<CartItem[]> {
    const items = await this.prisma.cartItem.findMany({ where: { productId } });
    return items.map(CartItem.fromObject);
  }

  async findByCartIdAndProductId(cartId: string, productId: string): Promise<CartItem | null> {
    const item = await this.prisma.cartItem.findUnique({ where: { cartId_productId: { cartId, productId } } });
    return item ? CartItem.fromObject(item) : null;
  }

  async create(createCartItemDto: CreateCartItemDto): Promise<CartItem> {
    const createdItem = await this.prisma.cartItem.create({ data: createCartItemDto });
    return CartItem.fromObject(createdItem);
  }

  async update(id: string, updateCartItemDto: UpdateCartItemDto): Promise<CartItem> {
    const updatedItem = await this.prisma.cartItem.update({ where: { id }, data: updateCartItemDto });
    return CartItem.fromObject(updatedItem);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.cartItem.delete({ where: { id } });
    return true;
  }

  async deleteManyByCartId(cartId: string): Promise<boolean> {
    await this.prisma.cartItem.deleteMany({ where: { cartId } });
    return true;
  }
}
