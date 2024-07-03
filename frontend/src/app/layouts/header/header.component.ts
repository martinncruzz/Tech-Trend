import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  AuthService,
  CategoriesService,
  FiltersService,
  PaginationService,
} from '../../core/services';
import { Category } from '../../core/interfaces/categories';

@Component({
  selector: 'layouts-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styles: ``,
})
export class HeaderComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);

  public isLoggedIn = computed(() => this.authService.isLoggedIn());
  public isAdmin = computed(() => this.authService.isAdmin());
  public categories = signal<Category[]>([]);

  constructor() {}

  ngOnInit(): void {
    this.getAllCategories();
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

  public logout(): void {
    this.authService.logout();
  }
}
