import { Injectable, Logger, NotFoundException } from '@nestjs/common';

import { handleDBExceptions } from '../shared/helpers';
import { PaginationDto } from '../shared/dtos';
import { PrismaService } from 'src/database/prisma.service';
import { UpdateUserDto } from './dtos';

@Injectable()
export class UsersService {
  private readonly logger = new Logger('UsersService');

  constructor(private readonly prismaService: PrismaService) {}

  async getAllUsers(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;

    const users = await this.prismaService.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
    });

    return users;
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
}
