import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  forwardRef,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidRoles } from '@prisma/client';

import { BcryptAdapter } from 'src/config';
import { handleDBExceptions } from '../shared/helpers';
import { JwtPayload } from './interfaces';
import { LoginUserDto, RegisterUserDto } from './dtos';
import { PrismaService } from 'src/database/prisma.service';
import { User } from '../users/entities';
import { ShoppingCartsService } from '../shopping-carts/shopping-carts.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger('AuthService');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(forwardRef(() => ShoppingCartsService))
    private readonly shoppingCartsService: ShoppingCartsService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, ...userData } = registerUserDto;

    const user = await this.getUserByEmail(email);

    if (user) throw new BadRequestException('Email already registered');

    try {
      const user = await this.prismaService.user.create({
        data: {
          ...userData,
          email: email.toLowerCase(),
          password: BcryptAdapter.hash(password),
          roles: [ValidRoles.user],
        },
      });

      await this.shoppingCartsService.createCart(user);

      return user;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.getUserByEmail(loginUserDto.email);

    if (!user) throw new BadRequestException(`Incorrect email or password`);

    const isMatching = BcryptAdapter.compare(
      loginUserDto.password,
      user.password,
    );

    if (!isMatching)
      throw new BadRequestException(`Incorrect email or password`);

    const token = this.generateToken({ user_id: user.user_id });

    return {
      token,
      userRoles: user.roles,
    };
  }

  checkAuthStatus(user: User) {
    return user;
  }

  private async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  private generateToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
