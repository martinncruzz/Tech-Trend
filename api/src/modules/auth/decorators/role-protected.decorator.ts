import { SetMetadata } from '@nestjs/common';

import { UserRoles } from '@modules/shared/interfaces/enums';

export const METADATA_ROLES_KEY = 'roles';

export function RoleProtected(...roles: UserRoles[]) {
  return SetMetadata(METADATA_ROLES_KEY, roles);
}
