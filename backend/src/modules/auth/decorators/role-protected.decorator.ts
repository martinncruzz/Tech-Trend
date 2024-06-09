import { SetMetadata } from '@nestjs/common';
import { ValidRoles } from '@prisma/client';

export const META_ROLES = 'roles';

export const RoleProtected = (...roles: ValidRoles[]) => {
  return SetMetadata(META_ROLES, roles);
};
