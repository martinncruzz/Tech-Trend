import { Injectable, InternalServerErrorException, RawBodyRequest } from '@nestjs/common';
import { Request, Response } from 'express';
import Stripe from 'stripe';

import { envs } from '../../config';
import { User } from '../users';
import { ProductsService } from '../products';
import { ShoppingCartsService } from '../shopping-carts';
import { OrdersService } from '../orders';
import { CheckoutSessionMetadata, PaymentSessionDto } from '.';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET_KEY);

  constructor(
    private readonly productsService: ProductsService,
    private readonly shoppingCartsService: ShoppingCartsService,
    private readonly ordersService: OrdersService,
  ) {}

  async createPaymentSession(paymentSessionDto: PaymentSessionDto, user: User) {
    const { shopping_cart_id } = paymentSessionDto;

    const shoppingCart = await this.shoppingCartsService.validateShoppingCart(shopping_cart_id, user.user_id);

    const lineItems = shoppingCart.products.map((product) => {
      return {
        price_data: {
          currency: 'usd',
          product_data: { name: product.product.name, images: [product.product.image_url] },
          unit_amount: Math.round(product.product.price * 100),
        },
        quantity: product.quantity,
      };
    });

    const session = await this.stripe.checkout.sessions.create({
      line_items: lineItems,
      metadata: { user_id: user.user_id, shopping_cart_id },
      mode: 'payment',
      success_url: `${envs.FRONTEND_URL}/orders`,
      cancel_url: `${envs.FRONTEND_URL}/shopping-cart`,
    });

    return {
      url: session.url,
      success_url: session.success_url,
      cancel_url: session.cancel_url,
    };
  }

  async stripeWebhook(req: RawBodyRequest<Request>, res: Response) {
    const sig = req.headers['stripe-signature'];
    const endpointSecret = envs.STRIPE_ENDPOINT_SECRET;

    if (!sig) {
      throw new InternalServerErrorException('Missing Stripe signature header');
    }

    if (!req.rawBody) {
      throw new InternalServerErrorException('Missing rawBody in request');
    }

    const event: Stripe.Event = this.stripe.webhooks.constructEvent(req.rawBody, sig, endpointSecret);

    switch (event.type) {
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object as Stripe.Checkout.Session & {
          metadata: CheckoutSessionMetadata;
        };

        if (!checkoutSessionCompleted.metadata) {
          throw new InternalServerErrorException('Metadata is missing in the Stripe event');
        }

        const { user_id, shopping_cart_id } = checkoutSessionCompleted.metadata;

        if (!user_id || !shopping_cart_id) {
          throw new InternalServerErrorException('Required metadata fields are missing');
        }

        const shoppingCart = await this.shoppingCartsService.getShoppingCartById(shopping_cart_id);
        const order = await this.ordersService.createOrder({ user_id, total: shoppingCart.total });

        const items = shoppingCart.products.map((productItem) => {
          return {
            product_id: productItem.product_id,
            quantity: productItem.quantity,
            subtotal: productItem.subtotal,
          };
        });

        await this.ordersService.addProductsToOrderDetails({ order_id: order.order_id, products: items });
        await Promise.all(
          shoppingCart.products.map((product) =>
            this.productsService.updateProductStock(product.product_id, product.quantity),
          ),
        );

        await this.shoppingCartsService.emptyCart(shoppingCart.shopping_cart_id);
        break;

      default:
        throw new InternalServerErrorException(`Event ${event.type} not handled`);
    }

    return res.status(200).json({ sig });
  }
}
