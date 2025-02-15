import { Injectable, NotFoundException } from '@nestjs/common';

import { buildBaseUrl } from '../../modules/shared/helpers/base-url.builder';
import { buildFiltersQuery } from '../../modules/shared/helpers/filters-query.builder';
import { buildPagination } from '../../modules/shared/helpers/pagination.builder';
import { CreateOrderDto } from '../../modules/orders/dtos/create-order.dto';
import { Order } from '../../modules/orders/entities/order.entity';
import { OrderFiltersDto } from '../../modules/orders/dtos/order-filters.dto';
import { OrderItemsRepository } from '../../modules/orders/repositories/order-items.repository';
import { OrdersRepository } from '../../modules/orders/repositories/orders.repository';
import { ResourceType } from '../../modules/shared/interfaces/enums';

@Injectable()
export class OrdersService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
  ) {}

  async getOrders(
    orderFiltersDto: OrderFiltersDto,
  ): Promise<{ prev: string | null; next: string | null; orders: Order[] }> {
    const { total, orders } = await this.ordersRepository.findAll(orderFiltersDto);

    const filtersQuery = buildFiltersQuery(orderFiltersDto);
    const baseUrl = buildBaseUrl(ResourceType.ORDERS);
    const { prev, next } = buildPagination(orderFiltersDto, total, baseUrl, filtersQuery);

    return { prev, next, orders };
  }

  async getOrdersByUserId(
    orderFiltersDto: OrderFiltersDto,
    userId: string,
  ): Promise<{ prev: string | null; next: string | null; orders: Order[] }> {
    const { total, orders } = await this.ordersRepository.findAllByUserId(orderFiltersDto, userId);

    const filtersQuery = buildFiltersQuery(orderFiltersDto);
    const baseUrl = buildBaseUrl(ResourceType.ORDERS);
    const { prev, next } = buildPagination(orderFiltersDto, total, baseUrl, filtersQuery);

    return { prev, next, orders };
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.ordersRepository.findById(id);

    if (!order) throw new NotFoundException(`Order with id "${id}" not found`);

    return order;
  }

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const createdOrder = await this.ordersRepository.create(createOrderDto);
    await this.orderItemsRepository.createMany(createdOrder.id, createOrderDto);

    return createdOrder;
  }

  async deleteOrderItemsByProductId(productId: string): Promise<boolean> {
    await this.orderItemsRepository.deleteManyByProductId(productId);
    return true;
  }

  async deleteOrdersByUserId(userId: string): Promise<boolean> {
    const { orders } = await this.ordersRepository.findAllByUserId({ page: 1, limit: Number.MAX_SAFE_INTEGER }, userId);
    const orderIds = orders.map((order) => order.id);

    if (orderIds.length > 0) {
      await this.orderItemsRepository.deleteManyByOrderIds(orderIds);
      await this.ordersRepository.deleteManyByUserId(userId);
    }

    return true;
  }
}
