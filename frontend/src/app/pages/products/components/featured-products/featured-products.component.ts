import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  FiltersService,
  PaginationService,
  ProductsService,
} from '../../../../core/services';
import { Product } from '../../../../core/interfaces/products';

@Component({
  selector: 'products-featured-products',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './featured-products.component.html',
  styles: ``,
})
export class FeaturedProductsComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);

  public products = signal<Product[]>([]);

  ngOnInit(): void {
    this.paginationService.setPagination(1, 4);
    this.getAllProducts();
  }

  public getAllProducts(): void {
    this.productsService
      .getAllProducts(
        this.paginationService.pagination(),
        this.filtersService.filter(),
        undefined,
        true
      )
      .subscribe({
        next: ({ items }) => {
          this.products.set(items);
        },
        error: (err) => console.log(err),
      });
  }
}
