import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsDashboardComponent } from './pages/products-dashboard/products-dashboard.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products-dashboard', component: ProductsDashboardComponent },
  { path: 'product-form/new-product', component: ProductFormComponent },
  { path: 'product-form/edit/:id', component: ProductFormComponent },
  { path: '**', redirectTo: 'dashboard' },
];
