import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services';
import { HotToastService } from '@ngxpert/hot-toast';

export const isAuthenticatedGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const hotToastService = inject(HotToastService);

  if (authService.isLoggedIn()) return true;

  hotToastService.warning('Please log in first');
  router.navigateByUrl('/auth/login');
  return false;
};
