import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ValidRoles } from '@prisma/client';

import { User } from '../users';
import { Auth, GetUser } from '../auth';
import { PaymentSessionDto, PaymentsService } from '.';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-payment-session')
  @Auth(ValidRoles.user)
  createPaymentSession(@Body() paymentSessionDto: PaymentSessionDto, @GetUser() user: User) {
    return this.paymentsService.createPaymentSession(paymentSessionDto, user);
  }

  @Post('webhook')
  async stripeWebhook(@Req() req: Request, @Res() res: Response) {
    return this.paymentsService.stripeWebhook(req, res);
  }
}
