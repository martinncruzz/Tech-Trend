import { Injectable } from '@nestjs/common';

import { PostgresDatabase } from '@database/postgres/postgres-database';
import { RegisterUserDto } from '@modules/auth/dtos/register-user.dto';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';
import { User } from '@modules/users/entities/user.entity';
import { UserFiltersDto } from '@modules/users/dtos/user-filters.dto';
import { UserRoles } from '@modules/shared/interfaces/enums';
import { UsersRepository } from '@modules/users/repositories/users.repository';

@Injectable()
export class UsersRepositoryImpl implements UsersRepository {
  private readonly prisma = PostgresDatabase.getClient();

  async findAll(userFiltersDto: UserFiltersDto): Promise<{ total: number; users: User[] }> {
    const { page, limit, fullname, email, roles, sortBy, order } = userFiltersDto;
    const filters: Record<string, any> = {};

    if (fullname) filters.fullname = { contains: fullname, mode: 'insensitive' };
    if (email) filters.email = { contains: email, mode: 'insensitive' };
    if (roles) filters.roles = { has: roles };

    const [total, users] = await Promise.all([
      this.prisma.user.count({ where: filters }),
      this.prisma.user.findMany({
        where: filters,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: sortBy ? { [sortBy]: order } : undefined,
      }),
    ]);

    return { total, users: users.map(User.fromObject) };
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? User.fromObject(user) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { email } });
    return user ? User.fromObject(user) : null;
  }

  async create(registerUserDto: RegisterUserDto): Promise<User> {
    const createdUser = await this.prisma.user.create({ data: { ...registerUserDto, roles: [UserRoles.USER] } });
    return User.fromObject(createdUser);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const updatedUser = await this.prisma.user.update({ where: { id }, data: updateUserDto });
    return User.fromObject(updatedUser);
  }

  async delete(id: string): Promise<boolean> {
    await this.prisma.user.delete({ where: { id } });
    return true;
  }
}
