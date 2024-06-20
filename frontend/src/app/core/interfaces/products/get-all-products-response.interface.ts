import { Product } from './product.interface';

export interface GetAllProductsResponse {
  next: string | null;
  prev: string | null;
  items: Product[];
}
