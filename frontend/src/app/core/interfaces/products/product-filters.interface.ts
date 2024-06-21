import { SortBy } from './sort-by.enum';

export interface ProductFilters {
  search?: string;
  sortBy?: SortBy;
}
