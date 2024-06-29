import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { filter, mergeMap, tap } from 'rxjs';

import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../../../core/interfaces/products';
import {
  CategoriesService,
  FiltersService,
  PaginationService,
  ProductsService,
} from '../../../../core/services';
import { Category } from '../../../../core/interfaces/categories';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import { SortBy } from '../../../../core/interfaces/filters';

@Component({
  selector: 'products-products-list',
  standalone: true,
  imports: [RouterModule, ProductCardComponent, SearchInputComponent],
  templateUrl: './products-list.component.html',
  styles: ``,
})
export class ProductsListComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly productsService = inject(ProductsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);

  public filters = signal([
    { label: 'Newest', sort: SortBy.NEWEST },
    { label: 'Oldest', sort: SortBy.OLDEST },
    { label: 'From lowest to highest price', sort: SortBy.PRICE_ASC },
    { label: 'From highest to lowest price', sort: SortBy.PRICE_DESC },
    { label: 'From lowest to highest stock', sort: SortBy.STOCK_ASC },
    { label: 'From highest to lowest stock', sort: SortBy.STOCK_DESC },
  ]);
  public products = signal<Product[]>([]);
  public categories = signal<Category[]>([]);
  public currentCategory = signal<string | undefined>(undefined);

  public paginationButtons = computed(() =>
    this.paginationService.paginationButtons()
  );

  ngOnInit(): void {
    this.filtersService.resetFilters();
    this.paginationService.setPagination(1, 9);
    this.getAllCategories();

    this.activatedRoute.queryParams
      .pipe(
        tap(({ category }) => {
          if (!category) {
            this.currentCategory.update(() => undefined);
            this.getAllProducts();
          }
        }),
        filter(({ category }) => !!category),
        mergeMap(({ category }) =>
          this.categoriesService.getCategoryById(category)
        )
      )
      .subscribe((category) => {
        this.currentCategory.update(() => category.category_id);
        this.getAllProducts();
      });
  }

  public getAllCategories(): void {
    this.categoriesService
      .getAllCategories({ page: 1, limit: 10 }, {})
      .subscribe({
        next: ({ items }) => {
          this.categories.set(items);
        },
        error: (error) => console.log(error),
      });
  }

  public getAllProducts(): void {
    this.productsService
      .getAllProducts(
        this.paginationService.pagination(),
        this.filtersService.filter(),
        this.currentCategory(),
        true
      )
      .subscribe({
        next: ({ next, prev, items }) => {
          this.products.set(items);
          this.paginationService.setPaginationButtons(!!next, !!prev);
        },
        error: (err) => console.log(err),
      });
  }

  public searchProduct(query: string): void {
    this.filtersService.search(query, { page: 1, limit: 9 });
    this.getAllProducts();
  }

  public applyFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const filter = selectElement.value as SortBy;
    this.filtersService.applyFilter(filter, { page: 1, limit: 9 });
    this.getAllProducts();
  }

  public applyCategoryFilter(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;

    if (selectElement.value === 'all')
      this.currentCategory.update(() => undefined);
    else this.currentCategory.update(() => selectElement.value);

    this.getAllProducts();
  }

  public updatePage(value: number): void {
    this.paginationService.updatePage(value);
    window.scrollTo({ top: 0 });
    this.getAllProducts();
  }
}
