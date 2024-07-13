import { Routes } from '@angular/router';

import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import {
  isAdminGuard,
  isAuthenticatedGuard,
  isNotAuthenticatedGuard,
} from './core/guards';

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
        path: 'faq',
        loadComponent: () =>
          import('./pages/faq/faq.component').then((c) => c.FaqComponent),
      },
      {
        path: 'categories',
        loadComponent: () =>
          import('./pages/categories/categories.component').then(
            (c) => c.CategoriesComponent
          ),
      },
      {
        path: 'shopping-cart',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('./pages/shopping-carts/shopping-carts.component').then(
            (c) => c.ShoppingCartsComponent
          ),
      },
      {
        path: 'orders',
        canActivate: [isAuthenticatedGuard],
        loadComponent: () =>
          import('./pages/orders/orders.component').then(
            (c) => c.OrdersComponent
          ),
      },
      {
        path: 'auth',
        canActivate: [isNotAuthenticatedGuard],
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
    canActivate: [isAuthenticatedGuard, isAdminGuard],
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
