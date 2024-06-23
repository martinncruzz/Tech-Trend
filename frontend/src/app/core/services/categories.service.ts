import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  Category,
  CategoryForm,
  GetAllCategoriesResponse,
} from '../interfaces/categories';
import { Pagination } from '../interfaces/pagination';
import { Filters } from '../interfaces/filters';
import { FiltersService } from './filters.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private readonly filtersService = inject(FiltersService);

  private readonly backendUrl = environment.BACKEND_URL;
  private readonly http = inject(HttpClient);

  constructor() {}

  public getAllCategories(
    { page, limit }: Pagination,
    filters: Filters
  ): Observable<GetAllCategoriesResponse> {
    const filtersQuery = this.filtersService.getFiltersQuery(filters);

    return this.http
      .get<GetAllCategoriesResponse>(
        `${this.backendUrl}/categories?page=${page}&limit=${limit}${filtersQuery}`
      )
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public getCategoryById(id: string): Observable<Category> {
    return this.http
      .get<Category>(`${this.backendUrl}/categories/${id}`)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public createCategory(categoryForm: CategoryForm): Observable<Category> {
    return this.http
      .post<Category>(`${this.backendUrl}/categories`, categoryForm)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public updateCategory(
    categoryForm: CategoryForm,
    id: string
  ): Observable<Category> {
    return this.http
      .patch<Category>(`${this.backendUrl}/categories/${id}`, categoryForm)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public deleteCategory(id: string): Observable<boolean> {
    return this.http
      .delete<boolean>(`${this.backendUrl}/categories/${id}`)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }
}
