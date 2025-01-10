import { Controller, Get, Post, Patch, Body, Delete, Param, ParseUUIDPipe } from '@nestjs/common';

import { Auth } from '@modules/auth/decorators/auth.decorator';
import { CartItemDto } from '@modules/carts/dtos/cart-item.dto';
import { CartsService } from '@modules/carts/carts.service';
import { GetUser } from '@modules/auth/decorators/get-user.decorator';
import { User } from '@modules/users/entities/user.entity';
import { UserRoles } from '@modules/shared/interfaces/enums';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @Auth(UserRoles.USER)
  getCartByUserId(@GetUser() currentUser: User) {
    return this.cartsService.getCartByUserId(currentUser.id);
  }

  @Post()
  @Auth(UserRoles.USER)
  addItem(@Body() cartItemDto: CartItemDto, @GetUser() currentUser: User) {
    return this.cartsService.addItem(cartItemDto, currentUser.id);
  }

  @Patch()
  @Auth(UserRoles.USER)
  updateItem(@Body() cartItemDto: CartItemDto, @GetUser() currentUser: User) {
    return this.cartsService.updateItem(cartItemDto, currentUser.id);
  }

  @Delete('item/:productId')
  @Auth(UserRoles.USER)
  removeItem(@Param('productId', ParseUUIDPipe) productId: string, @GetUser() currentUser: User) {
    return this.cartsService.removeItem(productId, currentUser.id);
  }
}
