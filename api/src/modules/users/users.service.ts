import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';

import { buildBaseUrl } from '@modules/shared/helpers/base-url.builder';
import { buildFiltersQuery } from '@modules/shared/helpers/filters-query.builder';
import { buildPagination } from '@modules/shared/helpers/pagination.builder';
import { CartsService } from '@modules/carts/carts.service';
import { OrdersService } from '@modules/orders/orders.service';
import { ResourceType, UserRoles } from '@modules/shared/interfaces/enums';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';
import { User } from '@modules/users/entities/user.entity';
import { UserFiltersDto } from '@modules/users/dtos/user-filters.dto';
import { UsersRepository } from '@modules/users/repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cartsService: CartsService,
    private readonly ordersService: OrdersService,
  ) {}

  async getUsers(userFiltersDto: UserFiltersDto): Promise<{ prev: string | null; next: string | null; users: User[] }> {
    const { total, users } = await this.usersRepository.findAll(userFiltersDto);

    const filtersQuery = buildFiltersQuery(userFiltersDto);
    const baseUrl = buildBaseUrl(ResourceType.USERS);
    const { prev, next } = buildPagination(userFiltersDto, total, baseUrl, filtersQuery);

    return { prev, next, users };
  }

  async getUserById(id: string): Promise<User> {
    const user = await this.usersRepository.findById(id);

    if (!user) throw new NotFoundException(`User with id "${id}" not found`);

    return user;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto, currentUser: User): Promise<User> {
    const { fullname, email } = updateUserDto;

    const user = await this.getUserById(id);

    if (currentUser.id !== user.id && user.roles.includes(UserRoles.ADMIN)) {
      throw new ForbiddenException('You do not have permissions to edit or delete another administrator');
    }

    if (email && email !== user.email) {
      const userExists = await this.usersRepository.findByEmail(email);
      if (userExists) throw new BadRequestException('Email already registered');
    }

    return this.usersRepository.update(id, { fullname, email: email?.toLowerCase().trim() });
  }

  async deleteUser(id: string, currentUser: User): Promise<boolean> {
    if (currentUser.id === id) throw new BadRequestException('You cannot delete yourself');

    const user = await this.getUserById(id);

    if (user.roles.includes(UserRoles.ADMIN)) {
      throw new ForbiddenException('You do not have permissions to edit or delete another administrator');
    }

    await this.cartsService.deleteCartByUserId(id);
    await this.ordersService.deleteOrdersByUserId(id);
    await this.usersRepository.delete(id);

    return true;
  }
}
