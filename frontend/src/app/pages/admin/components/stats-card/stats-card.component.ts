import { Component, input } from '@angular/core';

@Component({
  selector: 'admin-stats-card',
  standalone: true,
  imports: [],
  templateUrl: './stats-card.component.html',
  styles: ``,
})
export class StatsCardComponent {
  public title = input.required<string>();
  public stat = input.required<number>();
}
