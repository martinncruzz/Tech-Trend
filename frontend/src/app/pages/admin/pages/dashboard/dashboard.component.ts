import { Component, inject, OnInit, signal } from '@angular/core';
import { ProductsChartComponent } from '../../components/products-chart/products-chart.component';
import { Product } from '../../../../core/interfaces/products';
import {
  CategoriesService,
  FiltersService,
  OrdersService,
  ProductsService,
  UsersService,
} from '../../../../core/services';
import { UsersChartComponent } from '../../components/users-chart/users-chart.component';
import { User } from '../../../../core/interfaces/users';
import { CategoriesChartComponent } from '../../components/categories-chart/categories-chart.component';
import { Category } from '../../../../core/interfaces/categories';
import { Order } from '../../../../core/interfaces/orders';
import { OrdersChartComponent } from '../../components/orders-chart/orders-chart.component';
import { StatsCardComponent } from '../../components/stats-card/stats-card.component';

@Component({
  selector: 'admin-dashboard',
  standalone: true,
  imports: [
    StatsCardComponent,
    OrdersChartComponent,
    CategoriesChartComponent,
    ProductsChartComponent,
    UsersChartComponent,
    OrdersChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styles: ``,
})
export class DashboardComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly productsService = inject(ProductsService);
  private readonly usersService = inject(UsersService);
  private readonly filtersService = inject(FiltersService);

  public orders = signal<Order[]>([]);
  public categories = signal<Category[]>([]);
  public products = signal<Product[]>([]);
  public users = signal<User[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.filtersService.resetFilters();
    this.getAllOrders();
    this.getAllCategories();
    this.getAllProducts();
    this.getAllUsers();
  }

  public getAllOrders(): void {
    this.ordersService
      .getAllOrders({ page: 1, limit: 100 }, this.filtersService.filter())
      .subscribe({
        next: ({ items }) => this.orders.set(items),
        error: (error) => console.log(error),
      });
  }

  public getAllCategories(): void {
    this.categoriesService
      .getAllCategories({ page: 1, limit: 100 }, this.filtersService.filter())
      .subscribe({
        next: ({ items }) => this.categories.set(items),
        error: (error) => console.log(error),
      });
  }

  public getAllProducts(): void {
    this.productsService
      .getAllProducts({ page: 1, limit: 100 }, this.filtersService.filter())
      .subscribe({
        next: ({ items }) => this.products.set(items),
        error: (error) => console.log(error),
      });
  }

  public getAllUsers(): void {
    this.usersService
      .getAllUsers({ page: 1, limit: 100 }, this.filtersService.filter())
      .subscribe({
        next: ({ items }) => this.users.set(items),
        error: (error) => console.log(error),
      });
  }
}
