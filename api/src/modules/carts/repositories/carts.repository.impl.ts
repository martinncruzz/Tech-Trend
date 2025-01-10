import { Injectable } from '@nestjs/common';

import { Cart } from '@modules/carts/entities/cart.entity';
import { CartsRepository } from '@modules/carts/repositories/carts.repository';
import { CreateCartDto } from '@modules/carts/dtos/create-cart.dto';
import { PostgresDatabase } from '@database/postgres/postgres-database';
import { UpdateCartDto } from '@modules/carts/dtos/update-cart.dto';

@Injectable()
export class CartsRepositoryImpl implements CartsRepository {
  private readonly prisma = PostgresDatabase.getClient();

  async findById(id: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { id },
      include: { items: { include: { product: true }, orderBy: { createdAt: 'desc' } } },
    });

    return cart ? Cart.fromObject(cart) : null;
  }

  async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await this.prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true }, orderBy: { createdAt: 'desc' } } },
    });

    return cart ? Cart.fromObject(cart) : null;
  }

  async create(createCartDto: CreateCartDto): Promise<Cart> {
    const createdCart = await this.prisma.cart.create({ data: createCartDto });
    return Cart.fromObject(createdCart);
  }

  async update(id: string, updateCartDto: UpdateCartDto): Promise<Cart> {
    const updatedCart = await this.prisma.cart.update({ where: { id }, data: updateCartDto });
    return Cart.fromObject(updatedCart);
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    await this.prisma.cart.delete({ where: { userId } });
    return true;
  }

  async deleteCartItemsByProductId(productId: string): Promise<boolean> {
    await this.prisma.cartItem.deleteMany({ where: { productId } });
    return true;
  }
}
