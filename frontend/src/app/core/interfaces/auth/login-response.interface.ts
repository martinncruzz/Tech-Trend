import { ValidRoles } from './valid-roles.enum';

export interface LoginResponse {
  token: string;
  userRoles: ValidRoles[];
}
