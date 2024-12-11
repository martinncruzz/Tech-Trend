import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { envs } from '../../config';
import { PrismaModule } from '../../database';
import { UsersModule } from '../users';
import { ShoppingCartsModule } from '../shopping-carts';
import { AuthController, AuthService, JwtStrategy } from '.';

@Module({
  imports: [
    PrismaModule,
    UsersModule,
    ShoppingCartsModule,
    PassportModule,
    JwtModule.register({ secret: envs.JWT_SECRET, signOptions: { expiresIn: '1h' } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
