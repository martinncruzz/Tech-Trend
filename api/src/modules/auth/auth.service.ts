import { BadRequestException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ValidRoles } from '@prisma/client';

import { BcryptAdapter } from '../../config';
import { PrismaService } from '../../database';
import { User, UsersService } from '../users';
import { ShoppingCartsService } from '../shopping-carts';
import { JwtPayload, LoginUserDto, RegisterUserDto } from '.';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => ShoppingCartsService))
    private readonly shoppingCartsService: ShoppingCartsService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    const { email, password, ...userData } = registerUserDto;

    const userExists = await this.usersService.getUserByEmail(email);
    if (userExists) throw new BadRequestException('Email already registered');

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
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user = await this.usersService.getUserByEmail(loginUserDto.email);
    if (!user) throw new BadRequestException(`Incorrect email or password`);

    const isMatching = BcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw new BadRequestException(`Incorrect email or password`);

    const token = this.generateToken({ user_id: user.user_id });

    return {
      token,
      userRoles: user.roles,
    };
  }

  checkAuthStatus(user: User) {
    return user;
  }

  private generateToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }
}
