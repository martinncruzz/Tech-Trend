import { Controller, Get, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ValidRoles } from '@prisma/client';

import { Filters } from '../shared';
import { Auth, GetUser } from '../auth';
import { UpdateUserDto, User, UsersService } from '.';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Auth(ValidRoles.admin)
  getAllUsers(@Query() params: Filters) {
    return this.usersService.getAllUsers(params);
  }

  @Get(':id')
  @Auth(ValidRoles.admin)
  getUserById(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  updateUser(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  deleteUser(@Param('id', ParseUUIDPipe) id: string, @GetUser() user: User) {
    return this.usersService.deleteUser(id, user);
  }
}
