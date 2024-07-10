import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Order, OrderDetails } from '../../core/interfaces/orders';
import { OrdersService } from '../../core/services';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.component.html',
  styles: ``,
})
export class OrdersComponent implements OnInit {
  private readonly ordersService = inject(OrdersService);

  public orders = signal<Order[]>([]);
  public orderDetails = signal<OrderDetails | undefined>(undefined);
  public totalSpent = computed<number>(() =>
    this.orders().reduce((n, order) => {
      return (n += order.total);
    }, 0)
  );

  constructor() {}

  ngOnInit(): void {
    this.getOrdersByUser();
  }

  public getOrdersByUser() {
    this.ordersService.getOrdersByUser().subscribe({
      next: (orders) => this.orders.set(orders),
      error: (error) => console.log(error),
    });
  }

  public getOrderDetails(id: string): void {
    this.ordersService.getOrderDetails(id).subscribe({
      next: (orderDetails) => this.orderDetails.set(orderDetails),
      error: (error) => console.log(error),
    });
  }
}
