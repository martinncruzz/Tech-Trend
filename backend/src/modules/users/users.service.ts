import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import {
  buildPaginationResponse,
  getBaseUrl,
  handleDBExceptions,
} from '../shared/helpers';
import { Prisma } from '@prisma/client';

import { Filters } from '../shared/dtos';
import { PrismaService } from 'src/database/prisma.service';
import { ResourceType } from '../shared/interfaces/pagination';
import { UpdateUserDto } from './dtos';
import { SortBy } from '../shared/interfaces/filters';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(private readonly prismaService: PrismaService) {}

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
    await this.getUserById(id);

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

  async deleteUser(id: string) {
    await this.getUserById(id);

    try {
      await this.prismaService.user.delete({
        where: { user_id: id },
      });

      return true;
    } catch (error) {
      handleDBExceptions(error, this.logger);
    }
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
