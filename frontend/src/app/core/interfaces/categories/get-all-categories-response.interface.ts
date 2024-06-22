import { Category } from './category.interface';

export interface GetAllCategoriesResponse {
  next: string | null;
  prev: string | null;
  items: Category[];
}
