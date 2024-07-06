import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { HotToastService } from '@ngxpert/hot-toast';

export const isNotAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const hotToastService = inject(HotToastService);

  if (authService.isLoggedIn()) {
    hotToastService.warning('You are already logged in');
    router.navigateByUrl('/');
    return false;
  }

  return true;
};
