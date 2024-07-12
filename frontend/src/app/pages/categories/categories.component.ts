import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { CategoryCardComponent } from './components/category-card/category-card.component';
import { Category } from '../../core/interfaces/categories';
import { CategoriesService, FiltersService } from '../../core/services';

@Component({
  selector: 'categories',
  standalone: true,
  imports: [CommonModule, CategoryCardComponent],
  templateUrl: './categories.component.html',
  styles: ``,
})
export class CategoriesComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly filtersService = inject(FiltersService);

  public categories = signal<Category[]>([]);

  constructor() {}
  ngOnInit(): void {
    this.filtersService.resetFilters();
    this.getAllCategories();
  }

  getAllCategories(): void {
    this.categoriesService
      .getAllCategories({ page: 1, limit: 9 }, this.filtersService.filter())
      .subscribe({
        next: ({ items }) => this.categories.set(items),
        error: (error) => {},
      });
  }
}
