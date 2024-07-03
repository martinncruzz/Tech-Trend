import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { map, catchError, of } from 'rxjs';

export const isAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.checkAuthStatus().pipe(
    map(() => {
      if (authService.isAdmin()) {
        return true;
      } else {
        router.navigateByUrl('/');
        return false;
      }
    }),
    catchError(() => {
      router.navigateByUrl('/');
      return of(false);
    })
  );
};
