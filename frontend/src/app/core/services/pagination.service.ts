import { Injectable, computed, signal } from '@angular/core';
import { Pagination, PaginationButtons } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root',
})
export class PaginationService {
  private _pagination = signal<Pagination>({
    page: 1,
    limit: 10,
  });

  private _paginationButtons = signal<PaginationButtons>({
    next: false,
    prev: false,
  });

  public pagination = computed<Pagination>(() => this._pagination());
  public paginationButtons = computed<PaginationButtons>(() =>
    this._paginationButtons()
  );

  constructor() {}

  public setPagination(page: number, limit: number): void {
    this._pagination.set({ page, limit });
  }

  public setPaginationButtons(next: boolean, prev: boolean): void {
    this._paginationButtons.set({ next, prev });
  }

  public updatePage(value: number): void {
    this._pagination.update((val) => ({ ...val, page: val.page + value }));
  }
}
