import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ShoppingCartsService } from './shopping-carts.service';
import { AddProductToCartDto, UpdateProductQuantityInCartDto } from './dtos';
import { Auth, GetUser } from '../auth/decorators';
import { User } from '../users/entities';
import { ValidRoles } from '@prisma/client';

@Controller('shopping-carts')
export class ShoppingCartsController {
  constructor(private readonly shoppingCartsService: ShoppingCartsService) {}

  @Post()
  @Auth(ValidRoles.user)
  addProductToCart(
    @Body() addProductToCartDto: AddProductToCartDto,
    @GetUser() user: User,
  ) {
    return this.shoppingCartsService.addProductToCart(
      addProductToCartDto,
      user,
    );
  }

  @Get()
  @Auth(ValidRoles.user)
  getUserShoppingCart(@GetUser() user: User) {
    return this.shoppingCartsService.getUserShoppingCart(user);
  }

  @Patch()
  @Auth(ValidRoles.user)
  updateProductQuantityInCart(
    @Body() updateProductQuantityInCartDto: UpdateProductQuantityInCartDto,
    @GetUser() user: User,
  ) {
    return this.shoppingCartsService.updateProductQuantityInCart(
      updateProductQuantityInCartDto,
      user,
    );
  }

  @Delete(':productId')
  @Auth(ValidRoles.user)
  removeProductFromCart(
    @Param('productId', ParseUUIDPipe) productId: string,
    @GetUser() user: User,
  ) {
    return this.shoppingCartsService.removeProductFromCart(productId, user);
  }
}
