import { User } from './user.interface';

export interface GetAllUsersResponse {
  next: string | null;
  prev: string | null;
  items: User[];
}
