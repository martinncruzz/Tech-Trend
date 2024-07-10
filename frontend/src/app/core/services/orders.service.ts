import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, catchError, throwError } from 'rxjs';
import {
  CreateOrderResponse,
  GetAllOrdersResponse,
  Order,
  OrderDetails,
} from '../interfaces/orders';
import { Pagination } from '../interfaces/pagination';
import { Filters } from '../interfaces/filters';
import { FiltersService } from './filters.service';

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private readonly filtersService = inject(FiltersService);

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

  public getAllOrders(
    { page, limit }: Pagination,
    filters: Filters
  ): Observable<GetAllOrdersResponse> {
    const filtersQuery = this.filtersService.getFiltersQuery(filters);

    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<GetAllOrdersResponse>(
        `${this.backendUrl}/orders?page=${page}&limit=${limit}${filtersQuery}`,
        { headers }
      )
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public getOrdersByUser(): Observable<Order[]> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<Order[]>(`${this.backendUrl}/orders/my-orders`, {
        headers,
      })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public getOrderDetails(id: string): Observable<OrderDetails> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<OrderDetails>(`${this.backendUrl}/orders/${id}/details`, {
        headers,
      })
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }
}
