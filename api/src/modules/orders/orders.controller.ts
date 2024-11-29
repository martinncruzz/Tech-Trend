import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ValidRoles } from '@prisma/client';

import { Filters } from '../shared';
import { User } from '../users';
import { Auth, GetUser } from '../auth';
import { OrdersService } from '.';

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
