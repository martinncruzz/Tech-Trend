import { Routes } from '@angular/router';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ProductsDashboardComponent } from './pages/products-dashboard/products-dashboard.component';
import { ProductFormComponent } from './pages/product-form/product-form.component';
import { CategoriesDashboardComponent } from './pages/categories-dashboard/categories-dashboard.component';
import { CategoryFormComponent } from './pages/category-form/category-form.component';
import { UsersDashboardComponent } from './pages/users-dashboard/users-dashboard.component';

export const ADMIN_ROUTES: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  { path: 'products-dashboard', component: ProductsDashboardComponent },
  { path: 'product-form/new-product', component: ProductFormComponent },
  { path: 'product-form/edit/:id', component: ProductFormComponent },
  { path: 'categories-dashboard', component: CategoriesDashboardComponent },
  { path: 'category-form/new-category', component: CategoryFormComponent },
  { path: 'category-form/edit/:id', component: CategoryFormComponent },
  { path: 'users-dashboard', component: UsersDashboardComponent },
  { path: '**', redirectTo: 'dashboard' },
];
