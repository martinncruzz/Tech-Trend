import { ValidRoles } from '@prisma/client';

export class User {
  user_id: string;
  fullname: string;
  address: string;
  email: string;
  password: string;
  roles: ValidRoles[];
  createdAt: Date;
  updatedAt: Date;
}
