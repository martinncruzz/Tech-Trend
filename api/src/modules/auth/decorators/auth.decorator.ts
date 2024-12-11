import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ValidRoles } from '@prisma/client';

import { RoleProtected, UserRoleGuard } from '..';

export function Auth(...roles: ValidRoles[]) {
  return applyDecorators(RoleProtected(...roles), UseGuards(AuthGuard('jwt'), UserRoleGuard));
}
