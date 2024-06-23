import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {
  CategoriesService,
  ValidatorsService,
} from '../../../../core/services';
import { Category } from '../../../../core/interfaces/categories';
import { switchMap } from 'rxjs';

@Component({
  selector: 'admin-category-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styles: ``,
})
export class CategoryFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  private readonly categoriesService = inject(CategoriesService);
  private readonly validatorsService = inject(ValidatorsService);

  public errorMessage = signal<string | null>(null);
  public currentCategory = signal<Category | undefined>(undefined);

  public categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(5)]],
    description: ['', [Validators.required, Validators.minLength(10)]],
  });

  constructor() {}

  ngOnInit(): void {
    this.resetFormErrors();

    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.categoriesService.getCategoryById(id)))
      .subscribe((category) => {
        this.currentCategory.set(category);
        this.categoryForm.reset(category);
      });
  }

  public createCategory(): void {
    this.categoriesService.createCategory(this.categoryForm.value).subscribe({
      next: () => this.router.navigateByUrl('admin/categories-dashboard'),
      error: (error) => this.errorMessage.set(error),
    });
  }

  public updateCategory(): void {
    this.categoriesService
      .updateCategory(
        this.categoryForm.value,
        this.currentCategory()!.category_id
      )
      .subscribe({
        next: () => this.router.navigateByUrl('admin/categories-dashboard'),
        error: (error) => this.errorMessage.set(error),
      });
  }

  public isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.categoryForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.categoryForm, field);
  }

  private resetFormErrors(): void {
    this.categoryForm.valueChanges.subscribe(() => {
      this.errorMessage.set(null);
    });
  }
}
