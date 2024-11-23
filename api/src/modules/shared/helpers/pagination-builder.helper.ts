import { envs } from '../../../config';
import { PaginationParams, PaginationResponse } from '../interfaces/pagination';
import { ResourceType } from '../interfaces/pagination/resource-type.enum';

export function getBaseUrl(resourceType: ResourceType): string {
  return `${envs.BACKEND_URL}/${resourceType}`;
}

export function buildPaginationResponse<T>({
  page,
  limit,
  total,
  baseUrl,
  items,
}: PaginationParams<T>): PaginationResponse<T> {
  const next = limit * page >= total ? null : `${baseUrl}?page=${page + 1}&limit=${limit}`;
  const prev = page - 1 === 0 ? null : `${baseUrl}?page=${page - 1}&limit=${limit}`;

  return {
    next,
    prev,
    items,
  };
}
