import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, catchError, map, of, tap, throwError } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  CheckAuthStatusResponse,
  LoginForm,
  LoginResponse,
  RegisterForm,
  RegisterResponse,
  ValidRoles,
} from '../interfaces/auth';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly backendUrl: string = environment.BACKEND_URL;
  private readonly http = inject(HttpClient);

  private _isLoggedIn = signal<boolean>(false);
  private _isAdmin = signal<boolean>(false);

  public isLoggedIn = computed(() => this._isLoggedIn());
  public isAdmin = computed(() => this._isAdmin());

  constructor() {
    this._isLoggedIn.set(!!localStorage.getItem('token'));
    this.checkAuthStatus().subscribe();
  }

  public registerUser(
    registerForm: RegisterForm
  ): Observable<RegisterResponse> {
    return this.http
      .post<RegisterResponse>(`${this.backendUrl}/auth/register`, registerForm)
      .pipe(catchError((err) => throwError(() => err.error.message)));
  }

  public loginUser(loginForm: LoginForm): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.backendUrl}/auth/login`, loginForm)
      .pipe(
        tap(({ token, userRoles }) => this.setAuthentication(token, userRoles)),
        catchError((err) => throwError(() => err.error.message))
      );
  }

  public checkAuthStatus(): Observable<boolean> {
    const token = localStorage.getItem('token');

    if (!token) {
      this.logout();
      return of(false);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http
      .get<CheckAuthStatusResponse>(`${this.backendUrl}/auth/check-status`, {
        headers,
      })
      .pipe(
        map(({ roles }) => {
          this._isLoggedIn.set(true);
          this._isAdmin.set(this.hasAdminRole(roles));
          return true;
        }),
        catchError(() => {
          this.logout();
          return of(false);
        })
      );
  }

  public logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRoles');

    this._isLoggedIn.set(false);
    this._isAdmin.set(false);
  }

  private setAuthentication(token: string, userRoles: ValidRoles[]): void {
    localStorage.setItem('token', token);
    localStorage.setItem('userRoles', JSON.stringify(userRoles));

    this._isLoggedIn.set(true);
    this._isAdmin.set(this.hasAdminRole(userRoles));
  }

  private hasAdminRole(roles: ValidRoles[]): boolean {
    return roles.includes(ValidRoles.admin);
  }
}
