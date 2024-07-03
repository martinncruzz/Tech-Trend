import { ValidRoles } from '../auth';

export interface User {
  user_id: string;
  fullname: string;
  address: string;
  email: string;
  password: string;
  roles: ValidRoles[];
  createdAt: Date;
  updatedAt: Date | null;
}
