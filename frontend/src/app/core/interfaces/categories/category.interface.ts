import { Product } from '../products';

export interface Category {
  category_id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date | null;
  products: Product[];
}
