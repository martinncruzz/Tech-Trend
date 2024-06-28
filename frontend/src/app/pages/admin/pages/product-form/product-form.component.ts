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

import {
  CategoriesService,
  FiltersService,
  PaginationService,
  ProductsService,
  ValidatorsService,
} from '../../../../core/services';
import { Product } from '../../../../core/interfaces/products';
import { Category } from '../../../../core/interfaces/categories';

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
  private readonly categoriesService = inject(CategoriesService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);
  private readonly validatorsService = inject(ValidatorsService);

  public errorMessage = signal<string | null>(null);
  public currentProduct = signal<Product | undefined>(undefined);
  public categories = signal<Category[]>([]);

  public productForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
    price: [1, [Validators.required, Validators.min(1)]],
    stock: [1, [Validators.required, Validators.min(1)]],
    file: [null],
    category_id: ['', [Validators.required]],
  });

  constructor() {}

  ngOnInit(): void {
    this.paginationService.setPagination(1, 10);
    this.filtersService.resetFilters();
    this.getAllCategories();

    this.resetFormErrors();

    if (!this.router.url.includes('edit')) {
      this.productForm.controls['file'].setValidators([Validators.required]);
      this.productForm.controls['file'].updateValueAndValidity();
      return;
    }

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.productsService.getProductById(id)))
      .subscribe((product) => {
        this.currentProduct.set(product);
        this.productForm.reset(product);
      });
  }

  public createProduct(): void {
    this.productForm.disable();

    const formData = new FormData();
    Object.keys(this.productForm.controls).forEach((key) => {
      formData.append(key, this.productForm.controls[key].value);
    });

    this.productsService.createProduct(formData).subscribe({
      next: () => this.router.navigateByUrl('admin/products-dashboard'),
      error: (error) => this.errorMessage.set(error),
    });
  }

  public updateProduct(): void {
    this.productForm.disable();

    const formData = new FormData();
    const fileExists = !!this.productForm.controls['file'].value;

    Object.keys(this.productForm.controls).forEach((key) => {
      if (fileExists || key !== 'file') {
        formData.append(key, this.productForm.controls[key].value);
      }
    });

    this.productsService
      .updateProduct(formData, this.currentProduct()!.product_id)
      .subscribe({
        next: () => this.router.navigateByUrl('admin/products-dashboard'),
        error: (error) => this.errorMessage.set(error),
      });
  }

  public getAllCategories(): void {
    this.categoriesService
      .getAllCategories(
        this.paginationService.pagination(),
        this.filtersService.filter()
      )
      .subscribe({
        next: ({ items }) => {
          this.categories.set(items);
        },
        error: (error) => console.log(error),
      });
  }

  public updateNumberFormValue(field: string, value: number): void {
    const currentValue = this.productForm.controls[field].value;
    this.productForm.controls[field].setValue(currentValue + value);
    this.productForm.controls[field].markAsTouched();
  }

  public getFile(event: any): void {
    const file = event.target.files[0];
    this.productForm.patchValue({ file: file });
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
