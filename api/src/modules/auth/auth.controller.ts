import { Controller, Get, Post, Body } from '@nestjs/common';

import { Auth } from '@modules/auth/decorators/auth.decorator';
import { AuthService } from '@modules/auth/auth.service';
import { GetUser } from '@modules/auth/decorators/get-user.decorator';
import { LoginUserDto } from '@modules/auth/dtos/login-user.dto';
import { RegisterUserDto } from '@modules/auth/dtos/register-user.dto';
import { User } from '@modules/users/entities/user.entity';
import { UserRoles } from '@modules/shared/interfaces/enums';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.authService.registerUser(registerUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.loginUser(loginUserDto);
  }

  @Get('check-session')
  @Auth(UserRoles.USER)
  checkSession(@GetUser() currentUser: User) {
    return this.authService.checkSession(currentUser);
  }
}
