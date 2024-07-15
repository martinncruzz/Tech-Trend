import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { AddProductsToOrderDto, CreateOrderDto } from './dtos';
import { PrismaService } from '../../database/prisma.service';
import { OrderStatus, Prisma } from '@prisma/client';
import {
  buildPaginationResponse,
  getBaseUrl,
  handleDBExceptions,
} from '../shared/helpers';
import { Filters } from '../shared/dtos';
import { User } from '../users/entities';
import { SortBy } from '../shared/interfaces/filters';
import { ResourceType } from '../shared/interfaces/pagination';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger('OrdersService');

  constructor(private readonly prismaService: PrismaService) {}

  async createOrder(createOrderDto: CreateOrderDto) {
    try {
      const order = await this.prismaService.order.create({
        data: { ...createOrderDto, status: OrderStatus.PAID },
      });

      return order;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
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

    try {
      await this.prismaService.orderProduct.createMany({
        data: orderDetails,
      });

      return true;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getAllOrders(params: Filters) {
    const { page = 1, limit = 10 } = params;

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

    const baseUrl = getBaseUrl(ResourceType.orders);
    const paginationResponse = buildPaginationResponse({
      page,
      limit,
      total,
      baseUrl,
      items: orders,
    });

    return paginationResponse;
  }

  async getOrdersByUser(user: User) {
    const orders = await this.prismaService.order.findMany({
      where: { user_id: user.user_id },
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

    console.log(orders)

    try {
      const result = await this.prismaService.$transaction([
        this.prismaService.orderProduct.deleteMany({
          where: { order_id: { in: orders.map((order) => order.order_id) } },
        }),
        this.prismaService.order.deleteMany({
          where: { user_id: user.user_id },
        }),
      ]);

      console.log(result);

      return true;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  private buildOrderBy(
    params: Filters,
  ): Prisma.OrderOrderByWithAggregationInput {
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
