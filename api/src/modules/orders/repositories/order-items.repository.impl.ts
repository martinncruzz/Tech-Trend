import { Injectable } from '@nestjs/common';

import { OrderItemsRepository } from '@modules/orders/repositories/order-items.repository';
import { PostgresDatabase } from '@database/postgres/postgres-database';
import { CreateOrderDto } from '@modules/orders/dtos/create-order.dto';
import { OrderItem } from '@modules/orders/entities/order-item.entity';

@Injectable()
export class OrderItemsRepositoryImpl implements OrderItemsRepository {
  private readonly prisma = PostgresDatabase.getClient();

  async createMany(orderId: string, createOrderDto: CreateOrderDto): Promise<OrderItem[]> {
    const createdItems = await this.prisma.orderItem.createManyAndReturn({
      data: createOrderDto.items.map((item) => ({ ...item, orderId })),
    });

    return createdItems.map(OrderItem.fromObject);
  }

  async deleteManyByProductId(productId: string): Promise<boolean> {
    await this.prisma.orderItem.deleteMany({ where: { productId } });
    return true;
  }

  async deleteManyByOrderIds(orderIds: string[]): Promise<boolean> {
    await this.prisma.orderItem.deleteMany({ where: { orderId: { in: orderIds } } });
    return true;
  }
}
