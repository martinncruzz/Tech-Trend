import { Injectable, computed, inject, signal } from '@angular/core';

import { Filters, SortBy } from '../interfaces/filters';
import { PaginationService } from './pagination.service';
import { Pagination } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  private readonly paginationService = inject(PaginationService);

  public filter = signal<Filters>({
    search: '',
    sortBy: SortBy.NEWEST,
  });

  constructor() {}

  public resetFilters(): void {
    this.filter.set({ search: '', sortBy: SortBy.NEWEST });
  }

  public applyFilter(sortBy: SortBy, { page, limit }: Pagination): void {
    this.paginationService.setPagination(page, limit);
    this.filter.update((currentFilter) => ({ ...currentFilter, sortBy }));
  }

  public search(search: string, { page, limit }: Pagination): void {
    this.paginationService.setPagination(page, limit);
    this.filter.update((currentFilter) => ({ ...currentFilter, search }));
  }

  public getFiltersQuery(
    filters: Filters,
    categoryId?: string,
    status?: boolean
  ): string {
    let filtersQuery = ``;

    if (filters.search) filtersQuery += `&search=${filters.search}`;
    if (filters.sortBy) filtersQuery += `&sortBy=${filters.sortBy}`;
    if (categoryId) filtersQuery += `&categoryId=${categoryId}`;
    if (status) filtersQuery += `&status=available`;

    return filtersQuery;
  }
}
