import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';

import { PrismaService } from '../../database';
import { User } from '../users';
import { ProductsService } from '../products';
import { AddProductToCartDto, ShoppingCart, ShoppingCartProduct, UpdateProductQuantityInCartDto } from '.';

@Injectable()
export class ShoppingCartsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

  async addProductToCart(addProductToCartDto: AddProductToCartDto, user: User) {
    const { product_id, quantity } = addProductToCartDto;

    const userShoppingCart = await this.getUserShoppingCart(user);
    const product = await this.productsService.validateProduct(product_id, quantity);

    const productAdded = await this.prismaService.shoppingCartProduct.create({
      data: {
        shopping_cart_id: userShoppingCart.shopping_cart_id,
        product_id,
        quantity,
        subtotal: product.price * quantity,
      },
    });

    await this.updateCartTotal(productAdded);

    return true;
  }

  async getShoppingCartById(id: string) {
    const shoppingCart = await this.prismaService.shoppingCart.findUnique({
      where: { shopping_cart_id: id },
      include: { products: true },
    });

    if (!shoppingCart) throw new NotFoundException(`Cart with id #${id} not found`);

    return shoppingCart;
  }

  async getUserShoppingCart(user: User) {
    const userShoppingCart = await this.prismaService.shoppingCart.findUnique({
      where: { user_id: user.user_id },
      include: { products: { include: { product: true }, orderBy: { createdAt: 'desc' } } },
    });

    if (!userShoppingCart) throw new NotFoundException(`User with id "${user.user_id}" does not have a shopping cart`);

    return userShoppingCart;
  }

  async updateProductQuantityInCart(updateProductQuantityInCartDto: UpdateProductQuantityInCartDto, user: User) {
    const { product_id, quantity } = updateProductQuantityInCartDto;

    const userShoppingCart = await this.getUserShoppingCart(user);
    const product = await this.productsService.validateProduct(product_id, quantity);
    const cartItem = await this.validateProductExistenceInCart(product_id, userShoppingCart);

    if (cartItem.quantity + quantity === 0) throw new BadRequestException(`Product quantity cannot be 0`);

    const updatedProduct = await this.prismaService.shoppingCartProduct.update({
      where: {
        shopping_cart_id_product_id: { product_id: product_id, shopping_cart_id: userShoppingCart.shopping_cart_id },
      },
      data: {
        quantity: (cartItem.quantity += quantity),
        subtotal: (cartItem.subtotal += quantity * product.price),
        updatedAt: new Date(),
      },
    });

    await this.updateCartTotal({ ...updatedProduct, subtotal: quantity * product.price });

    return true;
  }

  async removeProductFromCart(productId: string, user: User) {
    const shoppingCart = await this.getUserShoppingCart(user);

    await this.validateProductExistenceInCart(productId, shoppingCart);

    const removedProduct = await this.prismaService.shoppingCartProduct.delete({
      where: {
        shopping_cart_id_product_id: { product_id: productId, shopping_cart_id: shoppingCart.shopping_cart_id },
      },
    });

    removedProduct.subtotal *= -1;
    await this.updateCartTotal(removedProduct);

    return true;
  }

  async updateCartTotal(product: ShoppingCartProduct) {
    const shoppingCart = await this.getShoppingCartById(product.shopping_cart_id);

    const { shopping_cart_id, subtotal } = product;

    await this.prismaService.shoppingCart.update({
      where: { shopping_cart_id: shopping_cart_id },
      data: { total: (shoppingCart.total += subtotal), updatedAt: new Date() },
    });

    return true;
  }

  async createCart(user: User) {
    await this.prismaService.shoppingCart.create({ data: { user_id: user.user_id, total: 0 } });
    return true;
  }

  async emptyCart(shoppingCartId: string) {
    await this.prismaService.$transaction([
      this.prismaService.shoppingCartProduct.deleteMany({ where: { shopping_cart_id: shoppingCartId } }),
      this.prismaService.shoppingCart.update({ where: { shopping_cart_id: shoppingCartId }, data: { total: 0 } }),
    ]);

    return true;
  }

  async deleteUserCart(user: User) {
    const shoppingCart = await this.getUserShoppingCart(user);

    await this.prismaService.$transaction([
      this.prismaService.shoppingCartProduct.deleteMany({
        where: { shopping_cart_id: shoppingCart.shopping_cart_id },
      }),
      this.prismaService.shoppingCart.delete({ where: { user_id: user.user_id } }),
    ]);

    return true;
  }

  async validateShoppingCart(shoppingCartId: string, userId: string) {
    const shoppingCart = await this.prismaService.shoppingCart.findUnique({
      where: { shopping_cart_id: shoppingCartId, user_id: userId },
      include: { products: { include: { product: true }, orderBy: { createdAt: 'desc' } } },
    });

    if (!shoppingCart) throw new BadRequestException(`Invalid shopping cart`);
    if (shoppingCart.products.length === 0) throw new BadRequestException(`Shopping cart is empty`);

    await Promise.all(
      shoppingCart.products.map((product) =>
        this.productsService.validateProduct(product.product_id, product.quantity),
      ),
    );

    return shoppingCart;
  }

  private async validateProductExistenceInCart(productId: string, shoppingCart: ShoppingCart) {
    const productExists = await this.prismaService.shoppingCartProduct.findUnique({
      where: {
        shopping_cart_id_product_id: { product_id: productId, shopping_cart_id: shoppingCart.shopping_cart_id },
      },
    });

    if (!productExists) throw new NotFoundException(`Product with id #${productId} isn't in this shopping cart`);

    return productExists;
  }
}
