import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Order, OrderDetails } from '../../../../core/interfaces/orders';
import {
  FiltersService,
  OrdersService,
  PaginationService,
} from '../../../../core/services';
import { CommonModule } from '@angular/common';
import { SortBy } from '../../../../core/interfaces/filters';
import { PaginationButtons } from '../../../../core/interfaces/pagination';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'admin-orders-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders-dashboard.component.html',
  styles: ``,
})
export class OrdersDashboardComponent implements OnInit {
  private readonly hotToastService = inject(HotToastService);

  private readonly ordersService = inject(OrdersService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);

  public orders = signal<Order[]>([]);
  public orderDetails = signal<OrderDetails | undefined>(undefined);

  public processing = signal<boolean>(false);

  public paginationButtons = computed<PaginationButtons>(() =>
    this.paginationService.paginationButtons()
  );

  public sortBy = SortBy;
  public filter = computed(() => this.filtersService.filter());

  ngOnInit(): void {
    this.paginationService.setPagination(1, 5);
    this.filtersService.resetFilters();
    this.getAllOrders();
  }

  constructor() {}

  public getAllOrders(): void {
    this.ordersService
      .getAllOrders(
        this.paginationService.pagination(),
        this.filtersService.filter()
      )
      .subscribe({
        next: ({ next, prev, items }) => {
          this.orders.set(items);
          this.paginationService.setPaginationButtons(!!next, !!prev);
        },
        error: (error) => this.hotToastService.error(error),
      });
  }

  public getOrderDetails(id: string): void {
    this.ordersService.getOrderDetails(id).subscribe({
      next: (orderDetails) => this.orderDetails.set(orderDetails),
      error: (error) => this.hotToastService.error(error),
    });
  }

  public applyFilter(filter: SortBy): void {
    this.filtersService.applyFilter(filter, { page: 1, limit: 5 });
    this.getAllOrders();
  }

  public updatePage(value: number): void {
    this.paginationService.updatePage(value);
    this.getAllOrders();
  }
}
