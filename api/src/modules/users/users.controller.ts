import { Controller, Get, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';

import { Auth } from '@modules/auth/decorators/auth.decorator';
import { GetUser } from '@modules/auth/decorators/get-user.decorator';
import { PaginationDto } from '@modules/shared/dtos/pagination.dto';
import { UpdateUserDto } from '@modules/users/dtos/update-user.dto';
import { User } from '@modules/users/entities/user.entity';
import { UserRoles } from '@modules/shared/interfaces/enums';
import { UsersService } from '@modules/users/users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(UserRoles.ADMIN)
  getUsers(@Query() paginationDto: PaginationDto) {
    return this.usersService.getUsers(paginationDto);
  }

  @Get(':id')
  @Auth(UserRoles.ADMIN)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @Auth(UserRoles.ADMIN)
  updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @GetUser() currentUser: User,
  ) {
    return this.usersService.updateUser(id, updateUserDto, currentUser);
  }

  @Delete(':id')
  @Auth(UserRoles.ADMIN)
  deleteUser(@Param('id', ParseUUIDPipe) id: string, @GetUser() currentUser: User) {
    return this.usersService.deleteUser(id, currentUser);
  }
}
