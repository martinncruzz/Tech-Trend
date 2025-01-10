import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { Cart } from '@modules/carts/entities/cart.entity';
import { CartItem } from '@modules/carts/entities/cart-item.entity';
import { CartItemDto } from '@modules/carts/dtos/cart-item.dto';
import { CartItemsRepository } from '@modules/carts/repositories/cart-items.repository';
import { CartsRepository } from '@modules/carts/repositories/carts.repository';
import { ProductsService } from '@modules/products/products.service';

@Injectable()
export class CartsService {
  constructor(
    private readonly cartsRepository: CartsRepository,
    private readonly cartItemsRepository: CartItemsRepository,

    @Inject(forwardRef(() => ProductsService))
    private readonly productsService: ProductsService,
  ) {}

  async getCartById(id: string): Promise<Cart> {
    const cart = await this.cartsRepository.findById(id);

    if (!cart) throw new NotFoundException(`Cart with id "${id}" not found`);

    return cart;
  }

  async getCartByUserId(userId: string): Promise<Cart> {
    const cart = await this.cartsRepository.findByUserId(userId);

    if (!cart) throw new NotFoundException(`Cart for user with id "${userId}" not found`);

    return cart;
  }

  async addItem(cartItemDto: CartItemDto, userId: string): Promise<CartItem> {
    const { productId, quantity } = cartItemDto;

    const cart = await this.getCartByUserId(userId);

    const cartItemExists = await this.cartItemsRepository.findByCartIdAndProductId(cart.id, productId);
    if (cartItemExists) throw new BadRequestException(`Product with id "${productId}" is already in this cart`);

    const product = await this.productsService.getProductById(productId);
    if (product.stock < quantity) throw new BadRequestException(`Only ${product.stock} "${product.name}" available`);

    const createdItem = await this.cartItemsRepository.create({
      cartId: cart.id,
      productId,
      quantity,
      subtotal: product.price * quantity,
    });

    await this.cartsRepository.update(cart.id, { total: cart.total + product.price * quantity });

    return createdItem;
  }

  async updateItem(cartItemDto: CartItemDto, userId: string): Promise<CartItem> {
    const { productId, quantity } = cartItemDto;

    const cart = await this.getCartByUserId(userId);

    const product = await this.productsService.getProductById(productId);
    if (product.stock < quantity) throw new BadRequestException(`Only ${product.stock} "${product.name}" available`);

    const cartItem = await this.cartItemsRepository.findByCartIdAndProductId(cart.id, productId);
    if (!cartItem) throw new NotFoundException(`Product with id "${productId}" is not in this cart`);

    const quantityDifference = quantity - cartItem.quantity;
    const subtotalDifference = quantityDifference * product.price;

    const updatedItem = await this.cartItemsRepository.update(cartItem.id, {
      quantity,
      subtotal: cartItem.subtotal + subtotalDifference,
    });

    await this.cartsRepository.update(cart.id, { total: cart.total + subtotalDifference });

    return updatedItem;
  }

  async removeItem(productId: string, userId: string): Promise<boolean> {
    const cart = await this.getCartByUserId(userId);

    const cartItem = await this.cartItemsRepository.findByCartIdAndProductId(cart.id, productId);
    if (!cartItem) throw new NotFoundException(`Product with id "${productId}" is not in this cart`);

    await this.cartItemsRepository.delete(cartItem.id);
    await this.cartsRepository.update(cart.id, { total: cart.total - cartItem.subtotal });

    return true;
  }

  async deleteCartItems(id: string): Promise<boolean> {
    const cart = await this.getCartById(id);

    await this.cartItemsRepository.deleteAllByCartId(cart.id);
    await this.cartsRepository.update(cart.id, { total: 0 });

    return true;
  }

  async deleteCartItemsByProductId(productId: string): Promise<boolean> {
    const cartItems = await this.cartItemsRepository.findAllByProductId(productId);

    for (const cartItem of cartItems) {
      const cart = await this.getCartById(cartItem.cartId);
      await this.cartItemsRepository.delete(cartItem.id);
      await this.cartsRepository.update(cart.id, { total: cart.total - cartItem.subtotal });
    }

    return true;
  }

  async deleteCartByUserId(userId: string): Promise<boolean> {
    const cart = await this.getCartByUserId(userId);

    await this.cartItemsRepository.deleteAllByCartId(cart.id);
    await this.cartsRepository.deleteByUserId(userId);

    return true;
  }

  async validateCartForPayment(id: string, userId: string): Promise<Cart> {
    const cart = await this.getCartById(id);

    if (!cart.items) throw new InternalServerErrorException('Cart data is incomplete');
    if (
      cart.items.some(
        (item) =>
          !item.productId ||
          !item.quantity ||
          !item.subtotal ||
          !item.product ||
          !item.product.name ||
          !item.product.price ||
          !item.product.stock ||
          !item.product.imageUrl,
      )
    ) {
      throw new InternalServerErrorException('Cart items data is incomplete');
    }

    if (cart.userId !== userId) throw new BadRequestException('Cart does not belong to the current user');
    if (cart.items.length === 0) throw new BadRequestException('Cart is empty');

    const productChecks = cart.items.map(async (item) => {
      const product = await this.productsService.getProductById(item.productId!);
      if (product.stock < item.quantity!) throw new BadRequestException(`Product "${product.name}" is out of stock`);
    });

    await Promise.all(productChecks);

    return cart;
  }
}
