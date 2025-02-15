import { CreateOrderDto } from '../../../modules/orders/dtos/create-order.dto';
import { OrderItem } from '../../../modules/orders/entities/order-item.entity';

export abstract class OrderItemsRepository {
  abstract createMany(orderId: string, createOrderDto: CreateOrderDto): Promise<OrderItem[]>;
  abstract deleteManyByProductId(productId: string): Promise<boolean>;
  abstract deleteManyByOrderIds(orderIds: string[]): Promise<boolean>;
}
