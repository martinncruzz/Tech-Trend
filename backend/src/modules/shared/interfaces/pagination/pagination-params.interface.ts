export interface PaginationParams<T> {
  page: number;
  limit: number;
  total: number;
  baseUrl: string;
  items: T[];
}
