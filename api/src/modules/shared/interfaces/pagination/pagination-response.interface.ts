export interface PaginationResponse<T> {
  next: string | null;
  prev: string | null;
  items: T[];
}
