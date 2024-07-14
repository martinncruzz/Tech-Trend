import { Component, input, OnChanges } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { Category } from '../../../../core/interfaces/categories';

@Component({
  selector: 'admin-categories-chart',
  standalone: true,
  imports: [],
  templateUrl: './categories-chart.component.html',
  styles: ``,
})
export class CategoriesChartComponent implements OnChanges {
  public categories = input.required<Category[]>();

  public categoriesChart?: Chart;

  ngOnChanges(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    if (this.categoriesChart) this.categoriesChart.destroy();

    const data = {
      labels: this.categories().map((category) => category.name),
      datasets: [
        {
          label: 'Products quantity',
          data: this.categories().map((category) => category.products.length),
          hoverOffset: 4,
        },
      ],
    };

    this.categoriesChart = new Chart('categoriesChart', {
      type: 'pie' as ChartType,
      data: data,
    });
  }
}
