import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '@prisma/client';
import { User } from '../users/entities';
import { Filters } from '../shared/dtos';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Auth(ValidRoles.admin)
  getAllOrders(@Query() params: Filters) {
    return this.ordersService.getAllOrders(params);
  }

  @Get('my-orders')
  @Auth(ValidRoles.user)
  getOrdersByUser(@GetUser() user: User) {
    return this.ordersService.getOrdersByUser(user);
  }

  @Get(':id/details')
  @Auth(ValidRoles.user)
  getOrderDetails(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrderDetails(id);
  }
}
