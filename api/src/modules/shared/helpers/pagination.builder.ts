import { PaginationDto } from '..';

interface PaginationResult {
  prev: string | null;
  next: string | null;
}

export function buildPagination(
  paginationDto: PaginationDto,
  total: number,
  baseUrl: string,
  filtersQuery: string = '',
): PaginationResult {
  const { page, limit } = paginationDto;

  const prev = page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}${filtersQuery}` : null;
  const next = limit * page < total ? `${baseUrl}?page=${page + 1}&limit=${limit}${filtersQuery}` : null;

  return { prev, next };
}
