import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RoleProtected } from '@modules/auth/decorators/role-protected.decorator';
import { UserRoleGuard } from '@modules/auth/guards/user-role.guard';
import { UserRoles } from '@modules/shared/interfaces/enums';

export function Auth(...roles: UserRoles[]) {
  return applyDecorators(RoleProtected(...roles), UseGuards(AuthGuard('jwt'), UserRoleGuard));
}
