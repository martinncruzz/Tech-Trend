import { User } from '../users';

export interface Order {
  order_id: string;
  user_id: string;
  total: number;
  status: string;
  createdAt: Date;
  updatedAt: null;
  user: User;
}
