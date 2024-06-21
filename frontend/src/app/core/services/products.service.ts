import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import {
  GetAllProductsResponse,
  Product,
  ProductFilters,
  ProductForm,
} from '../interfaces/products';
import { Pagination } from '../interfaces/pagination';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly backendUrl = environment.BACKEND_URL;
  private readonly http = inject(HttpClient);

  constructor() {}

  public getAllProducts(
    { page, limit }: Pagination,
    filters: ProductFilters
  ): Observable<GetAllProductsResponse> {
    const filtersQuery = this.getFiltersQuery(filters);

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

  public createProduct(productForm: ProductForm): Observable<Product> {
    return this.http
      .post<Product>(`${this.backendUrl}/products`, productForm)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public updateProduct(
    productForm: ProductForm,
    id: string
  ): Observable<Product> {
    return this.http
      .patch<Product>(`${this.backendUrl}/products/${id}`, productForm)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public deleteProduct(id: string): Observable<boolean> {
    return this.http
      .delete<boolean>(`${this.backendUrl}/products/${id}`)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  private getFiltersQuery(filters: ProductFilters): string {
    let filtersQuery = ``;

    if (filters.search) filtersQuery += `&search=${filters.search}`;
    if (filters.sortBy) filtersQuery += `&sortBy=${filters.sortBy}`;

    return filtersQuery;
  }
}
