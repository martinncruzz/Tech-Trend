import { Controller, Get, Post, Patch, Body, Delete, Param, ParseUUIDPipe } from '@nestjs/common';

import { Auth } from '@modules/auth/decorators/auth.decorator';
import { CartItemDto } from '@modules/carts/dtos/cart-item.dto';
import { CartsService } from '@modules/carts/carts.service';
import { GetUser } from '@modules/auth/decorators/get-user.decorator';
import { User } from '@modules/users/entities/user.entity';

@Controller('carts')
export class CartsController {
  constructor(private readonly cartsService: CartsService) {}

  @Get()
  @Auth()
  getCartByUserId(@GetUser() currentUser: User) {
    return this.cartsService.getCartByUserId(currentUser.id);
  }

  @Post()
  @Auth()
  addItem(@Body() cartItemDto: CartItemDto, @GetUser() currentUser: User) {
    return this.cartsService.addItem(cartItemDto, currentUser.id);
  }

  @Patch()
  @Auth()
  updateItem(@Body() cartItemDto: CartItemDto, @GetUser() currentUser: User) {
    return this.cartsService.updateItem(cartItemDto, currentUser.id);
  }

  @Delete('item/:productId')
  @Auth()
  removeItem(@Param('productId', ParseUUIDPipe) productId: string, @GetUser() currentUser: User) {
    return this.cartsService.removeItem(productId, currentUser.id);
  }
}
