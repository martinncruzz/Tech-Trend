import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsDashboardComponent } from './pages/products-dashboard/products-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products-dashboard', component: ProductsDashboardComponent },
  { path: '**', redirectTo: 'dashboard' },
];
