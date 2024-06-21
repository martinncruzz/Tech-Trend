import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  Product,
  ProductFilters,
  SortBy,
} from '../../../../core/interfaces/products';
import { PaginationService, ProductsService } from '../../../../core/services';
import { RouterModule } from '@angular/router';
import { PaginationButtons } from '../../../../core/interfaces/pagination';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';

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

  public products = signal<Product[]>([]);
  public currentProduct = signal<Product | undefined>(undefined);

  public paginationButtons = computed<PaginationButtons>(() =>
    this.paginationService.paginationButtons()
  );

  public sortBy = SortBy;
  public filter = signal<ProductFilters>({
    search: '',
    sortBy: SortBy.NEWEST,
  });

  constructor() {}

  ngOnInit(): void {
    this.paginationService.setPagination(1, 5);
    this.getAllProducts();
  }

  public getAllProducts(): void {
    this.productsService
      .getAllProducts(this.paginationService.pagination(), this.filter())
      .subscribe({
        next: ({ next, prev, items }) => {
          this.products.set(items);
          this.paginationService.setPaginationButtons(!!next, !!prev);
        },
        error: (err) => console.log(err),
      });
  }

  public deleteProduct(): void {
    this.productsService
      .deleteProduct(this.currentProduct()!.product_id)
      .subscribe({
        next: () => this.getAllProducts(),
        error: (err) => console.log(err),
      });
  }

  public updatePage(value: number): void {
    this.paginationService.updatePage(value);
    this.getAllProducts();
  }

  public applyFilter(sortBy: SortBy): void {
    this.paginationService.setPagination(1, 5);
    this.filter.update((currentFilter) => ({ ...currentFilter, sortBy }));
    this.getAllProducts();
  }

  public searchProduct(search: string): void {
    this.paginationService.setPagination(1, 5);
    this.filter.update((currentFilter) => ({ ...currentFilter, search }));
    this.getAllProducts();
  }
}
