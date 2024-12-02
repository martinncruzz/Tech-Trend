import { Injectable, NotFoundException } from '@nestjs/common';
import { OrderStatus, Prisma } from '@prisma/client';

import { PrismaService } from '../../database';
import { buildBaseUrl, buildPagination, Filters, ResourceType, SortBy } from '../shared';
import { User } from '../users';
import { AddProductsToOrderDto, CreateOrderDto } from '.';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    const order = await this.prismaService.order.create({ data: { ...createOrderDto, status: OrderStatus.PAID } });
    return order;
  }

  async addProductsToOrderDetails(addProductsToOrder: AddProductsToOrderDto) {
    const { order_id, products } = addProductsToOrder;

    const orderDetails = products.map((productItem) => {
      return {
        order_id: order_id,
        product_id: productItem.product_id,
        quantity: productItem.quantity,
        subtotal: productItem.subtotal,
      };
    });

    await this.prismaService.orderProduct.createMany({ data: orderDetails });

    return true;
  }

  async getAllOrders(params: Filters) {
    const { page, limit } = params;

    const orderBy = this.buildOrderBy(params);
    const where = this.buildWhere(params);

    const [total, orders] = await this.prismaService.$transaction([
      this.prismaService.order.count({ where }),
      this.prismaService.order.findMany({
        orderBy,
        where,
        include: { user: true },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const baseUrl = buildBaseUrl(ResourceType.orders);
    const { prev, next } = buildPagination({ page, limit }, total, baseUrl);

    return { prev, next, orders };
  }

  async getOrdersByUser(user: User) {
    const orders = await this.prismaService.order.findMany({
      where: { user_id: user.user_id },
      orderBy: { createdAt: 'desc' },
    });

    return orders;
  }

  async getOrderDetails(id: string) {
    const order = await this.prismaService.order.findUnique({
      where: { order_id: id },
      include: { products: { include: { product: true } } },
    });

    if (!order) throw new NotFoundException(`Order with id "${id}" not found`);

    return order;
  }

  async deleteUserOrders(user: User) {
    const orders = await this.getOrdersByUser(user);

    await this.prismaService.$transaction([
      this.prismaService.orderProduct.deleteMany({
        where: { order_id: { in: orders.map((order) => order.order_id) } },
      }),
      this.prismaService.order.deleteMany({ where: { user_id: user.user_id } }),
    ]);

    return true;
  }

  private buildOrderBy(params: Filters): Prisma.OrderOrderByWithAggregationInput {
    let orderBy: Prisma.OrderOrderByWithAggregationInput = {};

    switch (params.sortBy) {
      case SortBy.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
      case SortBy.OLDEST:
        orderBy = { createdAt: 'asc' };
        break;
      case SortBy.LAST_UPDATED:
        orderBy = { updatedAt: 'desc' };
        break;
    }

    return orderBy;
  }

  private buildWhere(params: Filters): Prisma.OrderWhereInput {
    const where: Prisma.OrderWhereInput = {};

    if (params.sortBy === SortBy.LAST_UPDATED) where.updatedAt = { not: null };

    return where;
  }
}
