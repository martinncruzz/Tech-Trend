import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import { CreateOrderResponse } from '../interfaces/orders';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly backendUrl = environment.BACKEND_URL;
  private readonly http = inject(HttpClient);

  constructor() {}

  public createOrder(
    shopping_cart_id: string
  ): Observable<CreateOrderResponse> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .post<CreateOrderResponse>(
        `${this.backendUrl}/payments/create-payment-session`,
        { shopping_cart_id },
        {
          headers,
        }
      )
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }
}
