import { Order } from './order.interface';

export interface GetAllOrdersResponse {
  next: null;
  prev: null;
  items: Order[];
}
