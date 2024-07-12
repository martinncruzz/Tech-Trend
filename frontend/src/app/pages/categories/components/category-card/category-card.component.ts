import { Component, input } from '@angular/core';
import { Category } from '../../../../core/interfaces/categories';
import { RouterModule } from '@angular/router';
import { CategoryImagePipe } from '../../../../core/pipes';

@Component({
  selector: 'categories-category-card',
  standalone: true,
  imports: [RouterModule, CategoryImagePipe],
  templateUrl: './category-card.component.html',
  styles: ``,
})
export class CategoryCardComponent {
  public category = input.required<Category>();
}
