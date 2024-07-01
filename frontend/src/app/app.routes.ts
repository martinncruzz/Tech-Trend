import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./pages/home/home.component').then((c) => c.HomeComponent),
      },
      {
        path: 'shopping-cart',
        loadComponent: () =>
          import('./pages/shopping-carts/shopping-carts.component').then(
            (c) => c.ShoppingCartsComponent
          ),
      },
      {
        path: 'auth',
        loadChildren: () =>
          import('./pages/auth/auth.routes').then((r) => r.AUTH_ROUTES),
      },
      {
        path: 'products',
        loadChildren: () =>
          import('./pages/products/products.routes').then(
            (r) => r.PRODUCTS_ROUTES
          ),
      },
    ],
  },
  {
    path: 'admin',
    component: AdminLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./pages/admin/admin.routes').then((r) => r.ADMIN_ROUTES),
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
