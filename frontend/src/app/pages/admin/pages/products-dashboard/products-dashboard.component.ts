import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Product } from '../../../../core/interfaces/products';
import {
  FiltersService,
  PaginationService,
  ProductsService,
} from '../../../../core/services';
import { RouterModule } from '@angular/router';
import { PaginationButtons } from '../../../../core/interfaces/pagination';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { SortBy } from '../../../../core/interfaces/filters';

@Component({
  selector: 'admin-products-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchInputComponent],
  templateUrl: './products-dashboard.component.html',
  styles: ``,
})
export class ProductsDashboardComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);

  public products = signal<Product[]>([]);
  public currentProduct = signal<Product | undefined>(undefined);
  public processing = signal<boolean>(false);

  public paginationButtons = computed<PaginationButtons>(() =>
    this.paginationService.paginationButtons()
  );

  public sortBy = SortBy;
  public filter = computed(() => this.filtersService.filter());

  constructor() {}

  ngOnInit(): void {
    this.paginationService.setPagination(1, 5);
    this.filtersService.resetFilters();
    this.getAllProducts();
  }

  public getAllProducts(): void {
    this.productsService
      .getAllProducts(
        this.paginationService.pagination(),
        this.filtersService.filter()
      )
      .subscribe({
        next: ({ next, prev, items }) => {
          this.products.set(items);
          this.paginationService.setPaginationButtons(!!next, !!prev);
        },
        error: (err) => console.log(err),
      });
  }

  public deleteProduct(): void {
    this.processing.update(() => true);
    this.productsService
      .deleteProduct(this.currentProduct()!.product_id)
      .subscribe({
        next: () => {
          this.getAllProducts();
          this.processing.update(() => false);
        },
        error: (err) => {
          this.processing.update(() => false);
          console.log(err);
        },
      });
  }

  public applyFilter(filter: SortBy): void {
    this.filtersService.applyFilter(filter, { page: 1, limit: 5 });
    this.getAllProducts();
  }

  public searchProduct(query: string): void {
    this.filtersService.search(query, { page: 1, limit: 5 });
    this.getAllProducts();
  }

  public updatePage(value: number): void {
    this.paginationService.updatePage(value);
    this.getAllProducts();
  }
}
