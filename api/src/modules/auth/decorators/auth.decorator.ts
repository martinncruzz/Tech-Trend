import { UseGuards, applyDecorators } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { RoleProtected } from '@modules/auth/decorators/role-protected.decorator';
import { UserRoleGuard } from '@modules/auth/guards/user-role.guard';
import { UserRoles } from '@modules/shared/interfaces/enums';

type AuthStrategy = 'jwt' | 'google' | 'facebook';

interface AuthOptions {
  strategy?: AuthStrategy;
  roles?: UserRoles[];
}

export function Auth(options: AuthOptions = {}) {
  const { strategy = 'jwt', roles = [UserRoles.USER] } = options;
  return applyDecorators(RoleProtected(...roles), UseGuards(AuthGuard(strategy), UserRoleGuard));
}
