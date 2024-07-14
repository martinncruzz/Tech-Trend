import { Component, input, OnChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';
import { User } from '../../../../core/interfaces/users';
import { MONTHS } from '../../../../core/constants';

@Component({
  selector: 'admin-users-chart',
  standalone: true,
  imports: [],
  templateUrl: './users-chart.component.html',
  styles: ``,
})
export class UsersChartComponent implements OnChanges {
  public users = input.required<User[]>();

  public usersChart?: Chart;

  ngOnChanges(): void {
    this.initializeChart();
  }

  private initializeChart(): void {
    if (this.usersChart) this.usersChart.destroy();

    const data = {
      labels: MONTHS.map((m) => m),
      datasets: [
        {
          label: 'Registered Users',
          data: this.calculateNewUsers(this.users()),
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1,
        },
      ],
    };

    this.usersChart = new Chart('usersChart', {
      type: 'line',
      data: data,
    });
  }

  private calculateNewUsers(users: User[]): number[] {
    const monthlyAdditions: number[] = Array(12).fill(0);

    users.forEach((user) => {
      const month = new Date(user.createdAt).getMonth();
      monthlyAdditions[month] += 1;
    });

    return monthlyAdditions;
  }
}
