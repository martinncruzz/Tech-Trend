import { Body, Controller, Post, RawBodyRequest, Req } from '@nestjs/common';
import { Request } from 'express';

import { Auth } from '../../modules/auth/decorators/auth.decorator';
import { GetUser } from '../../modules/auth/decorators/get-user.decorator';
import { PaymentSessionDto } from '../../modules/payments/dtos/payment-session.dto';
import { PaymentsService } from '../../modules/payments/payments.service';
import { User } from '../../modules/users/entities/user.entity';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  @Auth()
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto, @GetUser() currentUser: User) {
    return this.paymentsService.createPaymentSession(paymentSessionDto, currentUser.id);
  }

  @Post('webhook')
  stripeWebhook(@Req() req: RawBodyRequest<Request>) {
    return this.paymentsService.stripeWebhook(req);
  }
}
