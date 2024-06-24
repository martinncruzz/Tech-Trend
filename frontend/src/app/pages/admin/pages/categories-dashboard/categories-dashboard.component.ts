import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import {
  CategoriesService,
  FiltersService,
  PaginationService,
} from '../../../../core/services';
import { PaginationButtons } from '../../../../core/interfaces/pagination';
import { Category } from '../../../../core/interfaces/categories';
import { SortBy } from '../../../../core/interfaces/filters';

@Component({
  selector: 'admin-categories-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchInputComponent],
  templateUrl: './categories-dashboard.component.html',
  styles: ``,
})
export class CategoriesDashboardComponent implements OnInit {
  private readonly categoriesService = inject(CategoriesService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);

  public categories = signal<Category[]>([]);
  public currentCategory = signal<Category | undefined>(undefined);

  public paginationButtons = computed<PaginationButtons>(() =>
    this.paginationService.paginationButtons()
  );

  public sortBy = SortBy;
  public filter = computed(() => this.filtersService.filter());

  constructor() {}

  ngOnInit(): void {
    this.paginationService.setPagination(1, 5);
    this.filtersService.resetFilters();
    this.getAllCategories();
  }

  public getAllCategories(): void {
    this.categoriesService
      .getAllCategories(
        this.paginationService.pagination(),
        this.filtersService.filter()
      )
      .subscribe({
        next: ({ next, prev, items }) => {
          this.categories.set(items);
          this.paginationService.setPaginationButtons(!!next, !!prev);
        },
        error: (error) => console.log(error),
      });
  }

  public deleteCategory(): void {
    this.categoriesService
      .deleteCategory(this.currentCategory()!.category_id)
      .subscribe({
        next: () => this.getAllCategories(),
        error: (err) => console.log(err),
      });
  }

  public applyFilter(filter: SortBy): void {
    this.filtersService.applyFilter(filter, { page: 1, limit: 5 });
    this.getAllCategories();
  }

  public searchCategory(query: string): void {
    this.filtersService.search(query, { page: 1, limit: 5 });
    this.getAllCategories();
  }

  public updatePage(value: number): void {
    this.paginationService.updatePage(value);
    this.getAllCategories();
  }
}
