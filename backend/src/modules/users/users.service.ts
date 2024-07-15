import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import {
  buildPaginationResponse,
  getBaseUrl,
  handleDBExceptions,
} from '../shared/helpers';
import { Prisma, ValidRoles } from '@prisma/client';

import { Filters } from '../shared/dtos';
import { PrismaService } from '../../database/prisma.service';
import { ResourceType } from '../shared/interfaces/pagination';
import { UpdateUserDto } from './dtos';
import { SortBy } from '../shared/interfaces/filters';
import { User } from './entities';
import { ShoppingCartsService } from '../shopping-carts/shopping-carts.service';
import { OrdersService } from '../orders/orders.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(
    private readonly prismaService: PrismaService,
    private readonly shoppingCartService: ShoppingCartsService,
    private readonly ordersService: OrdersService,
  ) {}

  async getAllUsers(params: Filters) {
    const { page = 1, limit = 10 } = params;

    const orderBy = this.buildOrderBy(params);
    const where = this.buildWhere(params);

    const [total, users] = await this.prismaService.$transaction([
      this.prismaService.user.count({ where }),
      this.prismaService.user.findMany({
        orderBy,
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    const baseUrl = getBaseUrl(ResourceType.users);
    const paginationResponse = buildPaginationResponse({
      page,
      limit,
      total,
      baseUrl,
      items: users,
    });

    return paginationResponse;
  }

  async getUserById(id: string) {
    const user = await this.prismaService.user.findUnique({
      where: { user_id: id },
    });

    if (!user) throw new NotFoundException(`User with id "${id}" not found`);

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    const currentUser = await this.getUserById(id);

    this.validateUserRoles(currentUser);

    if (updateUserDto.email !== currentUser.email) {
      const user = await this.getUserByEmail(updateUserDto.email);
      if (user) throw new BadRequestException('Email already registered');
    }

    try {
      const user = await this.prismaService.user.update({
        where: { user_id: id },
        data: {
          ...updateUserDto,
          updatedAt: new Date(),
        },
      });

      return user;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async deleteUser(id: string, user: User) {
    if (user.user_id === id)
      throw new BadRequestException(`You cannot delete yourself`);

    const userToDelete = await this.getUserById(id);
    this.validateUserRoles(userToDelete);

    await this.shoppingCartService.deleteUserCart(userToDelete);
    await this.ordersService.deleteUserOrders(userToDelete);

    try {
      await this.prismaService.user.delete({
        where: { user_id: id },
      });

      return true;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
  }

  async getUserByEmail(email: string) {
    const user = await this.prismaService.user.findUnique({
      where: { email: email },
    });

    return user;
  }

  private validateUserRoles(user: User) {
    if (user.roles.includes(ValidRoles.admin))
      throw new ForbiddenException(
        `You don't have permissions to edit/delete another administrator`,
      );
  }

  private buildOrderBy(
    params: Filters,
  ): Prisma.UserOrderByWithAggregationInput {
    let orderBy: Prisma.UserOrderByWithAggregationInput = {};

    switch (params.sortBy) {
      case SortBy.NEWEST:
        orderBy = { createdAt: 'desc' };
        break;
      case SortBy.OLDEST:
        orderBy = { createdAt: 'asc' };
        break;
      case SortBy.LAST_UPDATED:
        orderBy = { updatedAt: 'desc' };
        break;
    }

    return orderBy;
  }

  private buildWhere(params: Filters): Prisma.UserWhereInput {
    const where: Prisma.UserWhereInput = {};

    if (params.search)
      where.email = { contains: params.search, mode: 'insensitive' };
    if (params.sortBy === SortBy.LAST_UPDATED) where.updatedAt = { not: null };

    return where;
  }
}
