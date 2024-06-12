import { Routes } from '@angular/router';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductDetailsComponent } from './pages/product-details/product-details.component';

export const PRODUCTS_ROUTES: Routes = [
  { path: '', component: ProductsListComponent },
  { path: 'details/:id', component: ProductDetailsComponent },
  { path: '**', redirectTo: '' },
];
