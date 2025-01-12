import { Injectable } from '@nestjs/common';

import { CreateOrderDto } from '@modules/orders/dtos/create-order.dto';
import { Order } from '@modules/orders/entities/order.entity';
import { OrderFiltersDto } from '@modules/orders/dtos/order-filters.dto';
import { OrdersRepository } from '@modules/orders/repositories/orders.repository';
import { OrderStatus } from '@modules/shared/interfaces/enums';
import { PostgresDatabase } from '@database/postgres/postgres-database';

@Injectable()
export class OrdersRepositoryImpl implements OrdersRepository {
  private readonly prisma = PostgresDatabase.getClient();

  async findAll(orderFiltersDto: OrderFiltersDto): Promise<{ total: number; orders: Order[] }> {
    const { page, limit, status, minTotal, maxTotal, sortBy, order } = orderFiltersDto;
    const filters: Record<string, any> = {};

    if (status) filters.status = status;
    if (minTotal) filters.total = { gte: minTotal };
    if (maxTotal) filters.total = { ...filters.total, lte: maxTotal };

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where: filters }),
      this.prisma.order.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: order } : undefined,
        include: { user: true },
      }),
    ]);

    return { total, orders: orders.map(Order.fromObject) };
  }

  async findAllByUserId(orderFiltersDto: OrderFiltersDto, userId: string): Promise<{ total: number; orders: Order[] }> {
    const { page, limit, status, minTotal, maxTotal, sortBy, order } = orderFiltersDto;
    const filters: Record<string, any> = {};

    if (status) filters.status = status;
    if (minTotal) filters.total = { gte: minTotal };
    if (maxTotal) filters.total = { ...filters.total, lte: maxTotal };

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where: { userId, ...filters } }),
      this.prisma.order.findMany({
        where: { userId, ...filters },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: order } : undefined,
        include: { user: true },
      }),
    ]);

    return { total, orders: orders.map(Order.fromObject) };
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });

    return order ? Order.fromObject(order) : null;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = await this.prisma.order.create({
      data: {
        userId: createOrderDto.userId,
        total: createOrderDto.total,
        receiptUrl: createOrderDto.receiptUrl,
        status: OrderStatus.PAID,
      },
    });

    return Order.fromObject(createdOrder);
  }

  async deleteManyByUserId(userId: string): Promise<boolean> {
    await this.prisma.order.deleteMany({ where: { userId } });
    return true;
  }
}
