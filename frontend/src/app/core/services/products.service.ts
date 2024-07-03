import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  GetAllProductsResponse,
  Product,
  ProductForm,
} from '../interfaces/products';
import { Pagination } from '../interfaces/pagination';
import { Filters } from '../interfaces/filters';
import { FiltersService } from './filters.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly filtersService = inject(FiltersService);

  private readonly backendUrl = environment.BACKEND_URL;
  private readonly http = inject(HttpClient);

  constructor() {}

  public getAllProducts(
    { page, limit }: Pagination,
    filters: Filters,
    categoryId?: string,
    status?: boolean
  ): Observable<GetAllProductsResponse> {
    const filtersQuery = this.filtersService.getFiltersQuery(
      filters,
      categoryId,
      status
    );

    return this.http
      .get<GetAllProductsResponse>(
        `${this.backendUrl}/products?page=${page}&limit=${limit}${filtersQuery}`
      )
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public getProductById(id: string): Observable<Product> {
    return this.http
      .get<Product>(`${this.backendUrl}/products/${id}`)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public createProduct(productForm: FormData): Observable<Product> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post<Product>(`${this.backendUrl}/products`, productForm, { headers })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public updateProduct(productForm: FormData, id: string): Observable<Product> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .patch<Product>(`${this.backendUrl}/products/${id}`, productForm, {
        headers,
      })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public deleteProduct(id: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .delete<boolean>(`${this.backendUrl}/products/${id}`, { headers })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }
}
