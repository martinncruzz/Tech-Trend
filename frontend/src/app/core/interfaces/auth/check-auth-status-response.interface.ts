import { ValidRoles } from './valid-roles.enum';

export interface CheckAuthStatusResponse {
  user_id: string;
  fullname: string;
  address: string;
  email: string;
  password: string;
  roles: ValidRoles[];
  createdAt: Date;
  updatedAt: Date | null;
}
