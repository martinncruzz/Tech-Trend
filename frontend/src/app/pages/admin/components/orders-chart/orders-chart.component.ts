import { Component, input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Order } from '../../../../core/interfaces/orders';
import { MONTHS } from '../../../../core/constants';

@Component({
  selector: 'admin-orders-chart',
  standalone: true,
  imports: [],
  templateUrl: './orders-chart.component.html',
  styles: ``,
})
export class OrdersChartComponent implements OnChanges {
  public orders = input.required<Order[]>();

  public ordersChart?: Chart;

  ngOnChanges(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    if (this.ordersChart) this.ordersChart.destroy();

    const data = {
      labels: MONTHS.map((m) => m),
      datasets: [
        {
          label: 'Orders placed',
          data: this.calculateOrdersPlaced(this.orders()),
          tension: 0.1,
        },
      ],
    };

    this.ordersChart = new Chart('ordersChart', {
      type: 'line',
      data: data,
    });
  }

  private calculateOrdersPlaced(orders: Order[]): number[] {
    const monthlyAdditions: number[] = Array(12).fill(0);

    orders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      monthlyAdditions[month] += 1;
    });

    return monthlyAdditions;
  }
}
