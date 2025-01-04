import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { METADATA_ROLES_KEY } from '@modules/auth/decorators/role-protected.decorator';
import { User } from '@modules/users/entities/user.entity';
import { UserRoles } from '@modules/shared/interfaces/enums';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const validRoles: UserRoles[] = this.reflector.get(METADATA_ROLES_KEY, context.getHandler());

    if (!validRoles) return true;
    if (validRoles.length === 0) return true;

    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    if (!user) throw new BadRequestException('User not found');

    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }

    throw new ForbiddenException(`User ${user.fullname} needs a valid role: [${validRoles}]`);
  }
}
