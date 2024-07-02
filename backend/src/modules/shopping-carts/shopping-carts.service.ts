import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  forwardRef,
} from '@nestjs/common';
import { AddProductToCartDto, UpdateProductQuantityInCartDto } from './dtos';
import { User } from '../users/entities';
import { PrismaService } from 'src/database/prisma.service';
import { handleDBExceptions } from '../shared/helpers';
import { ProductsService } from '../products/products.service';
import { ShoppingCart, ShoppingCartProduct } from './entities';

@Injectable()
export class ShoppingCartsService {
  private readonly logger = new Logger('ShoppingCartsService');

  constructor(
    private readonly prismaService: PrismaService,
    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async addProductToCart(addProductToCartDto: AddProductToCartDto, user: User) {
    const userShoppingCart = await this.getUserShoppingCart(user);
    const { product_id, quantity } = addProductToCartDto;

    const product = await this.productsService.validateProduct(
      product_id,
      quantity,
    );

    try {
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
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getUserShoppingCart(user: User) {
    const userShoppingCart = await this.prismaService.shoppingCart.findUnique({
      where: { user_id: user.user_id },
      include: {
        products: {
          include: { product: true },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!userShoppingCart)
      throw new NotFoundException(
        `User with id ${user.user_id} does not have a shopping cart`,
      );

    return userShoppingCart;
  }

  async updateProductQuantityInCart(
    updateProductQuantityInCartDto: UpdateProductQuantityInCartDto,
    user: User,
  ) {
    const userShoppingCart = await this.getUserShoppingCart(user);
    const { product_id, quantity } = updateProductQuantityInCartDto;

    const product = await this.productsService.validateProduct(
      product_id,
      quantity,
    );

    const cartItem = await this.validateProductExistenceInCart(
      product_id,
      userShoppingCart,
    );

    if (cartItem.quantity + quantity === 0)
      throw new BadRequestException(`Product quantity cannot be 0`);

    try {
      const updatedProduct =
        await this.prismaService.shoppingCartProduct.update({
          where: {
            shopping_cart_id_product_id: {
              product_id: product_id,
              shopping_cart_id: userShoppingCart.shopping_cart_id,
            },
          },
          data: {
            quantity: (cartItem.quantity += quantity),
            subtotal: (cartItem.subtotal += quantity * product.price),
            updatedAt: new Date(),
          },
        });

      await this.updateCartTotal({
        ...updatedProduct,
        subtotal: quantity * product.price,
      });

      return true;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async removeProductFromCart(productId: string, user: User) {
    const shoppingCart = await this.getUserShoppingCart(user);
    await this.validateProductExistenceInCart(productId, shoppingCart);

    try {
      const removedProduct =
        await this.prismaService.shoppingCartProduct.delete({
          where: {
            shopping_cart_id_product_id: {
              product_id: productId,
              shopping_cart_id: shoppingCart.shopping_cart_id,
            },
          },
        });

      removedProduct.subtotal *= -1;
      await this.updateCartTotal(removedProduct);

      return true;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async updateCartTotal(product: ShoppingCartProduct) {
    const shoppingCart = await this.getShoppingCartById(
      product.shopping_cart_id,
    );

    const { shopping_cart_id, subtotal } = product;

    try {
      await this.prismaService.shoppingCart.update({
        where: { shopping_cart_id: shopping_cart_id },
        data: {
          total: (shoppingCart.total += subtotal),
          updatedAt: new Date(),
        },
      });

      return true;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async createCart(user: User) {
    try {
      await this.prismaService.shoppingCart.create({
        data: { user_id: user.user_id, total: 0 },
      });
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  private async getShoppingCartById(id: string) {
    const shoppingCart = await this.prismaService.shoppingCart.findUnique({
      where: { shopping_cart_id: id },
    });

    if (!shoppingCart)
      throw new NotFoundException(`Cart with id #${id} not found`);

    return shoppingCart;
  }

  private async validateProductExistenceInCart(
    productId: string,
    shoppingCart: ShoppingCart,
  ) {
    const productExists =
      await this.prismaService.shoppingCartProduct.findUnique({
        where: {
          shopping_cart_id_product_id: {
            product_id: productId,
            shopping_cart_id: shoppingCart.shopping_cart_id,
          },
        },
      });

    if (!productExists)
      throw new NotFoundException(
        `Product with id #${productId} isn't in this shopping cart`,
      );

    return productExists;
  }
}
