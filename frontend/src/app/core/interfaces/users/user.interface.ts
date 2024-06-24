export interface User {
  user_id: string;
  fullname: string;
  address: string;
  email: string;
  password: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date | null;
}
