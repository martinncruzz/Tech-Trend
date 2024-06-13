import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((c) => c.HomeComponent),
  },
  {
    path: 'products',
    loadChildren: () =>
      import('./pages/products/products.routes').then((r) => r.PRODUCTS_ROUTES),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth/auth.routes').then((r) => r.AUTH_ROUTES),
  },
  {
    path: '**',
    redirectTo: '',
  },
];
