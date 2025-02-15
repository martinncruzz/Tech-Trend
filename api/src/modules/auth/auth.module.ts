import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from '../../modules/auth/auth.controller';
import { AuthService } from '../../modules/auth/auth.service';
import { CartsModule } from '../../modules/carts/carts.module';
import { envs } from '../../config/adapters/envs.adapter';
import { FacebookStrategy } from '../../modules/auth/strategies/facebook.strategy';
import { GoogleStrategy } from '../../modules/auth/strategies/google.strategy';
import { JwtStrategy } from '../../modules/auth/strategies/jwt.strategy';
import { UsersModule } from '../../modules/users/users.module';

@Module({
  imports: [
    UsersModule,
    CartsModule,
    PassportModule,
    JwtModule.register({ secret: envs.JWT_SECRET, signOptions: { expiresIn: '1h' } }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, GoogleStrategy, FacebookStrategy],
})
export class AuthModule {}
