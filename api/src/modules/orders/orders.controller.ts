import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';

import { Auth } from '@modules/auth/decorators/auth.decorator';
import { GetUser } from '@modules/auth/decorators/get-user.decorator';
import { OrderFiltersDto } from '@modules/orders/dtos/order-filters.dto';
import { OrdersService } from '@modules/orders/orders.service';
import { User } from '@modules/users/entities/user.entity';
import { UserRoles } from '@modules/shared/interfaces/enums';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @Auth({ roles: [UserRoles.ADMIN] })
  getOrders(@Query() orderFiltersDto: OrderFiltersDto) {
    return this.ordersService.getOrders(orderFiltersDto);
  }

  @Get('my-orders')
  @Auth()
  getOrdersByUserId(@Query() orderFiltersDto: OrderFiltersDto, @GetUser() currentUser: User) {
    return this.ordersService.getOrdersByUserId(orderFiltersDto, currentUser.id);
  }

  @Get(':id/details')
  @Auth()
  getOrderById(@Param('id', ParseUUIDPipe) id: string) {
    return this.ordersService.getOrderById(id);
  }
}
