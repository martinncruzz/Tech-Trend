import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import {
  GetShoppingCartResponse,
  ShoppingCartForm,
} from '../interfaces/shopping-carts';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ShoppingCartsService {
  private readonly backendUrl = environment.BACKEND_URL;
  private readonly http = inject(HttpClient);

  private _productIdsInCart = signal<string[]>([]);
  public productIdsInCart = computed(() => this._productIdsInCart());

  constructor() {}

  public addProductToCart(
    shoppingCartForm: ShoppingCartForm
  ): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post<boolean>(`${this.backendUrl}/shopping-carts`, shoppingCartForm, {
        headers,
      })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public getUserShoppingCart(): Observable<GetShoppingCartResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<GetShoppingCartResponse>(`${this.backendUrl}/shopping-carts`, {
        headers,
      })
      .pipe(
        tap((shoppingCart) =>
          this._productIdsInCart.set(
            shoppingCart.products.map((p) => p.product_id)
          )
        ),
        catchError((err) => throwError(() => err.error.message))
      );
  }

  public updateProductQuantityInCart(
    shoppingCartForm: ShoppingCartForm
  ): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .patch<boolean>(`${this.backendUrl}/shopping-carts`, shoppingCartForm, {
        headers,
      })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public removeProductFromCart(productId: string): Observable<boolean> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .delete<boolean>(`${this.backendUrl}/shopping-carts/${productId}`, {
        headers,
      })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }
}
