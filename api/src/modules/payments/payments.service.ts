import { Injectable, InternalServerErrorException, RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import Stripe from 'stripe';

import { CartsService } from '@modules/carts/carts.service';
import { envs } from '@config/adapters/envs.adapter';
import { OrdersService } from '@modules/orders/orders.service';
import { PaymentSessionDto } from '@modules/payments/dtos/payment-session.dto';
import { ProductsService } from '@modules/products/products.service';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(envs.STRIPE_SECRET_KEY);

  constructor(
    private readonly productsService: ProductsService,
    private readonly cartsService: CartsService,
    private readonly ordersService: OrdersService,
  ) {}

  async createPaymentSession(
    paymentSessionDto: PaymentSessionDto,
    userId: string,
  ): Promise<{ cancelUrl: string | null; successUrl: string | null; url: string | null }> {
    const { cartId } = paymentSessionDto;

    const { items } = await this.cartsService.validateCartForPayment(cartId, userId);

    const orderItems = items!.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: { name: item.product!.name!, images: [item.product!.imageUrl!] },
        unit_amount: Math.round(item.product!.price! * 100),
      },
      quantity: item.quantity,
    }));

    const paymentSession = await this.stripe.checkout.sessions.create({
      payment_intent_data: { metadata: { userId, cartId } },
      line_items: orderItems,
      mode: 'payment',
      success_url: `${envs.FRONTEND_URL}/orders`,
      cancel_url: `${envs.FRONTEND_URL}/shopping-cart`,
    });

    return {
      cancelUrl: paymentSession.cancel_url,
      successUrl: paymentSession.success_url,
      url: paymentSession.url,
    };
  }

  async stripeWebhook(req: RawBodyRequest<Request>): Promise<void> {
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
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        if (!chargeSucceeded.receipt_url) throw new InternalServerErrorException('Missing receipt_url');

        const payload = {
          stripePaymentId: chargeSucceeded.id,
          receiptUrl: chargeSucceeded.receipt_url,
          userId: chargeSucceeded.metadata.userId,
          cartId: chargeSucceeded.metadata.cartId,
        };

        const cart = await this.cartsService.validateCartForPayment(payload.cartId, payload.userId);

        const orderItems = cart.items!.map((item) => ({
          productId: item.productId!,
          quantity: item.quantity!,
          subtotal: item.subtotal!,
        }));

        await this.ordersService.createOrder({
          userId: payload.userId,
          items: orderItems,
          total: cart.total,
          receiptUrl: payload.receiptUrl,
        });

        await Promise.all(
          cart.items!.map(async (item) => {
            const updatedStock = item.product!.stock! - item.quantity!;
            await this.productsService.updateProduct(item.productId!, { stock: updatedStock });
          }),
        );

        await this.cartsService.deleteCartItems(payload.cartId);

        break;

      default:
        throw new InternalServerErrorException(`Event ${event.type} not handled`);
    }
  }
}
