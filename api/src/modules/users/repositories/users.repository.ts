import { CreateUserDto } from '@modules/users/dtos/create-user.dto';
import { PaginationDto } from '@modules/shared/dtos/pagination.dto';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';
import { User } from '@modules/users/entities/user.entity';

export abstract class UsersRepository {
  abstract findAll(paginationDto: PaginationDto): Promise<{ total: number; users: User[] }>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(createUserDto: CreateUserDto): Promise<User>;
  abstract update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  abstract delete(id: string): Promise<boolean>;
}
