export interface RegisterResponse {
  user_id: string;
  fullname: string;
  address: string;
  email: string;
  password: string;
  roles: string[];
  createdAt: Date;
  updatedAt: null;
}
