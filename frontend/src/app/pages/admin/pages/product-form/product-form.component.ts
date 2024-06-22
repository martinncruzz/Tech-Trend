import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs';
import { ProductsService, ValidatorsService } from '../../../../core/services';
import { Product } from '../../../../core/interfaces/products';

@Component({
  selector: 'admin-product-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styles: ``,
})
export class ProductFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly productsService = inject(ProductsService);
  private readonly validatorsService = inject(ValidatorsService);

  public errorMessage = signal<string | null>(null);
  public currentProduct = signal<Product | undefined>(undefined);

  public productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [1, [Validators.required, Validators.min(1)]],
    stock: [1, [Validators.required, Validators.min(1)]],
  });

  constructor() {}

  ngOnInit(): void {
    this.resetFormErrors();

    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.productsService.getProductById(id)))
      .subscribe((product) => {
        this.currentProduct.set(product);
        this.productForm.reset(product);
      });
  }

  public createProduct(): void {
    this.productsService.createProduct(this.productForm.value).subscribe({
      next: () => this.router.navigateByUrl('admin/products-dashboard'),
      error: (error) => this.errorMessage.set(error),
    });
  }

  public updateProduct(): void {
    this.productsService
      .updateProduct(this.productForm.value, this.currentProduct()!.product_id)
      .subscribe({
        next: () => this.router.navigateByUrl('admin/products-dashboard'),
        error: (error) => this.errorMessage.set(error),
      });
  }

  public updateNumberFormValue(field: string, value: number): void {
    const currentValue = this.productForm.controls[field].value;
    this.productForm.controls[field].setValue(currentValue + value);
    this.productForm.controls[field].markAsTouched();
  }

  public isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.productForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.productForm, field);
  }

  private resetFormErrors(): void {
    this.productForm.valueChanges.subscribe(() => {
      this.errorMessage.set(null);
    });
  }
}
