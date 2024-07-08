import { Injectable, Logger } from '@nestjs/common';
import { AddProductsToOrderDto, CreateOrderDto } from './dtos';
import { PrismaService } from 'src/database/prisma.service';
import { OrderStatus } from '@prisma/client';
import { handleDBExceptions } from '../shared/helpers';

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
}
