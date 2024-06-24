import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { FiltersService } from './filters.service';
import { Pagination } from '../interfaces/pagination';
import { Filters } from '../interfaces/filters';
import { Observable, catchError, throwError } from 'rxjs';
import { GetAllUsersResponse, User, UserForm } from '../interfaces/users';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private readonly filtersService = inject(FiltersService);

  private readonly backendUrl = environment.BACKEND_URL;
  private readonly http = inject(HttpClient);

  constructor() {}

  public getAllUsers(
    { page, limit }: Pagination,
    filters: Filters
  ): Observable<GetAllUsersResponse> {
    const filtersQuery = this.filtersService.getFiltersQuery(filters);

    return this.http
      .get<GetAllUsersResponse>(
        `${this.backendUrl}/users?page=${page}&limit=${limit}${filtersQuery}`
      )
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public getUserById(id: string): Observable<User> {
    return this.http
      .get<User>(`${this.backendUrl}/users/${id}`)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public updateUser(userForm: UserForm, id: string): Observable<User> {
    return this.http
      .patch<User>(`${this.backendUrl}/users/${id}`, userForm)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public deleteUser(id: string): Observable<boolean> {
    return this.http
      .delete<boolean>(`${this.backendUrl}/users/${id}`)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }
}
