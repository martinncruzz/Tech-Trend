import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductsService } from '../../../../core/services';
import { Product } from '../../../../core/interfaces/products';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';

@Component({
  selector: 'products-product-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
  styles: ``,
})
export class ProductDetailsComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly productsService = inject(ProductsService);

  public currentProduct = signal<Product | undefined>(undefined);

  constructor() {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.productsService.getProductById(id)))
      .subscribe({
        next: (product) => {
          if (product.stock === 0) this.router.navigateByUrl('/products');
          this.currentProduct.set(product);
        },
        error: (error) => this.router.navigateByUrl('/products'),
      });
  }
}
