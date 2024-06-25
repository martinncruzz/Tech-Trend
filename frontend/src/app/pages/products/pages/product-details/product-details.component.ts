import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { ProductsService, ValidatorsService } from '../../../../core/services';
import { Product } from '../../../../core/interfaces/products';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

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
  private readonly validatorsService = inject(ValidatorsService);

  public errorMessage = signal<string | null>(null);
  public currentProduct = signal<Product | undefined>(undefined);

  public quantityForm: FormGroup = this.fb.group({
    quantity: [1, [Validators.required, Validators.min(1)]],
  });

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
}
