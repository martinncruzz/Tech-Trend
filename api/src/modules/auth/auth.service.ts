import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { BcryptAdapter } from '@config/adapters/bcrypt.adapter';
import { CartsRepository } from '@modules/carts/repositories/carts.repository';
import { JwtPayload } from '@modules/auth/interfaces/jwt-payload.interface';
import { LoginUserDto } from '@modules/auth/dtos/login-user.dto';
import { RegisterUserDto } from '@modules/auth/dtos/register-user.dto';
import { User } from '@modules/users/entities/user.entity';
import { UsersRepository } from '@modules/users/repositories/users.repository';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cartsRepository: CartsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto): Promise<User> {
    const { fullname, email, password } = registerUserDto;

    const userExists = await this.usersRepository.findByEmail(email);
    if (userExists) throw new BadRequestException('Email already registered');

    const createdUser = await this.usersRepository.create({
      fullname,
      email: email.toLowerCase().trim(),
      password: BcryptAdapter.hash(password),
    });

    await this.cartsRepository.create({ userId: createdUser.id });

    return createdUser;
  }

  async loginUser(loginUserDto: LoginUserDto): Promise<{ token: string }> {
    const user = await this.usersRepository.findByEmail(loginUserDto.email);
    if (!user) throw new BadRequestException('Incorrect email or password');

    const isMatching = BcryptAdapter.compare(loginUserDto.password, user.password);
    if (!isMatching) throw new BadRequestException('Incorrect email or password');

    const payload: JwtPayload = { id: user.id, roles: user.roles };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async checkSession(currentUser: User): Promise<User> {
    return currentUser;
  }
}
