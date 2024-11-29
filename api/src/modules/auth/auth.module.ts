import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { envs } from '../../config';
import { PrismaModule } from '../../database';
import { UsersModule } from '../users';
import { ShoppingCartsModule } from '../shopping-carts';
import { AuthController, AuthService, JwtStrategy } from '.';

@Module({
  imports: [
    PrismaModule,
    forwardRef(() => UsersModule),
    forwardRef(() => ShoppingCartsModule),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({ secret: envs.JWT_SECRET, signOptions: { expiresIn: '1h' } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [PassportModule, JwtModule, JwtStrategy],
})
export class AuthModule {}
