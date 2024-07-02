import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import {
  ProductsService,
  ShoppingCartsService,
  ValidatorsService,
} from '../../../../core/services';
import { Product } from '../../../../core/interfaces/products';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { GetShoppingCartResponse } from '../../../../core/interfaces/shopping-carts';

@Component({
  selector: 'products-product-details',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styles: ``,
})
export class ProductDetailsComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly productsService = inject(ProductsService);
  private readonly shoppingCartsService = inject(ShoppingCartsService);
  private readonly validatorsService = inject(ValidatorsService);

  public errorMessage = signal<string | null>(null);
  public currentProduct = signal<Product | undefined>(undefined);
  public productId = signal<string>('');

  public shoppingCart = signal<GetShoppingCartResponse | undefined>(undefined);
  public productIdsInCart = computed(() =>
    this.shoppingCartsService.productIdsInCart()
  );

  public quantityForm: FormGroup = this.fb.group({
    quantity: [1],
  });

  constructor() {}

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.productsService.getProductById(id)))
      .subscribe({
        next: (product) => {
          if (product.stock === 0) this.router.navigateByUrl('/products');
          this.currentProduct.set(product);
          this.productId.set(product.product_id);
          this.setMaxQuantityValidation(product);
        },
        error: (error) => this.router.navigateByUrl('/products'),
      });

    this.getUserShoppingCart();
  }

  public getUserShoppingCart(): void {
    this.shoppingCartsService.getUserShoppingCart().subscribe({
      next: (shoppingCart) => this.shoppingCart.set(shoppingCart),
      error: (error) => console.log(error),
    });
  }

  public addProductToCart(): void {
    this.shoppingCartsService
      .addProductToCart({
        product_id: this.currentProduct()!.product_id,
        quantity: this.quantityForm.controls['quantity'].value,
      })
      .subscribe({
        next: () => this.getUserShoppingCart(),
        error: (error) => this.errorMessage.set(error),
      });
  }

  public removeProductFromCart(): void {
    this.shoppingCartsService
      .removeProductFromCart(this.productId())
      .subscribe({
        next: () => this.getUserShoppingCart(),
        error: (error) => this.errorMessage.set(error),
      });
  }

  public updateNumberFormValue(field: string, value: number): void {
    const currentValue = this.quantityForm.controls[field].value;
    this.quantityForm.controls[field].setValue(currentValue + value);
    this.quantityForm.controls[field].markAsTouched();
  }

  public isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.quantityForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.quantityForm, field);
  }

  private resetFormErrors(): void {
    this.quantityForm.valueChanges.subscribe(() => {
      this.errorMessage.set(null);
    });
  }

  private setMaxQuantityValidation(product: Product): void {
    this.quantityForm.controls['quantity'].setValidators([
      Validators.required,
      Validators.min(1),
      Validators.max(product.stock),
    ]);
    this.quantityForm.controls['quantity'].updateValueAndValidity();
  }
}
