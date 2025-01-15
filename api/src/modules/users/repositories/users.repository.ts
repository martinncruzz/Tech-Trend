import { RegisterUserDto } from '@modules/auth/dtos/register-user.dto';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';
import { User } from '@modules/users/entities/user.entity';
import { UserFiltersDto } from '@modules/users/dtos/user-filters.dto';

export abstract class UsersRepository {
  abstract findAll(userFiltersDto: UserFiltersDto): Promise<{ total: number; users: User[] }>;
  abstract findById(id: string): Promise<User | null>;
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(registerUserDto: RegisterUserDto): Promise<User>;
  abstract update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
  abstract delete(id: string): Promise<boolean>;
}
