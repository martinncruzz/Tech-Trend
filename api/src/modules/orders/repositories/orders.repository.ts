import { CreateOrderDto } from '@modules/orders/dtos/create-order.dto';
import { Order } from '@modules/orders/entities/order.entity';
import { OrderFiltersDto } from '@modules/orders/dtos/order-filters.dto';

export abstract class OrdersRepository {
  abstract findAll(orderFiltersDto: OrderFiltersDto): Promise<{ total: number; orders: Order[] }>;
  abstract findAllByUserId(
    orderFiltersDto: OrderFiltersDto,
    userId: string,
  ): Promise<{ total: number; orders: Order[] }>;
  abstract findById(id: string): Promise<Order | null>;
  abstract create(createOrderDto: CreateOrderDto): Promise<Order>;
  abstract deleteManyByUserId(userId: string): Promise<boolean>;
}
