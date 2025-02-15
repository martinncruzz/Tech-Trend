import { UserRoles } from '../../../modules/shared/interfaces/enums';

export interface JwtPayload {
  id: string;
  roles: UserRoles[];
}
