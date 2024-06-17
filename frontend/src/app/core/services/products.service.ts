import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Product, ProductForm } from '../interfaces/products';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private readonly backendUrl = environment.BACKEND_URL;
  private readonly http = inject(HttpClient);

  constructor() {}

  public getAllProducts(
    page: number = 1,
    limit: number = 10
  ): Observable<Product[]> {
    return this.http
      .get<Product[]>(`${this.backendUrl}/products?page=${page}&limit=${limit}`)
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
}
