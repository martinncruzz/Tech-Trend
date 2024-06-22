import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { Product } from '../../../../core/interfaces/products';
import {
  FiltersService,
  PaginationService,
  ProductsService,
} from '../../../../core/services';

@Component({
  selector: 'products-products-list',
  standalone: true,
  imports: [RouterModule, ProductCardComponent],
  templateUrl: './products-list.component.html',
  styles: ``,
})
export class ProductsListComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);

  public products = signal<Product[]>([]);

  ngOnInit(): void {
    this.paginationService.setPagination(1, 9);
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
}
