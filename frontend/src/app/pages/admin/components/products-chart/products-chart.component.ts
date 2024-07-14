import { Component, input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { Product } from '../../../../core/interfaces/products';

@Component({
  selector: 'admin-products-chart',
  standalone: true,
  imports: [],
  templateUrl: './products-chart.component.html',
  styles: ``,
})
export class ProductsChartComponent implements OnChanges {
  public products = input.required<Product[]>();

  public productsChart?: Chart;

  ngOnChanges(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    if (this.productsChart) this.productsChart.destroy();

    const data = {
      labels: this.products().map((product) => product.name),
      datasets: [
        {
          label: 'Products Stock',
          data: this.products().map((product) => product.stock),
        },
      ],
    };

    this.productsChart = new Chart('productsChart', {
      type: 'bar',
      data: data,
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Stock',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Products',
            },
          },
        },
      },
    });
  }
}
