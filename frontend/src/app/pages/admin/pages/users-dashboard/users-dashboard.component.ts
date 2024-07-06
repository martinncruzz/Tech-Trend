import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SearchInputComponent } from '../../../../shared/components/search-input/search-input.component';
import {
  FiltersService,
  PaginationService,
  UsersService,
  ValidatorsService,
} from '../../../../core/services';
import { SortBy } from '../../../../core/interfaces/filters';
import { PaginationButtons } from '../../../../core/interfaces/pagination';
import { User } from '../../../../core/interfaces/users';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { patterns } from '../../../../core/constants';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'admin-users-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    SearchInputComponent,
  ],
  templateUrl: './users-dashboard.component.html',
  styles: ``,
})
export class UsersDashboardComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly hotToastService = inject(HotToastService);

  private readonly usersService = inject(UsersService);
  private readonly paginationService = inject(PaginationService);
  private readonly filtersService = inject(FiltersService);
  private readonly validatorsService = inject(ValidatorsService);

  public users = signal<User[]>([]);
  public currentUser = signal<User | undefined>(undefined);
  public processing = signal<boolean>(false);

  public paginationButtons = computed<PaginationButtons>(() =>
    this.paginationService.paginationButtons()
  );

  public sortBy = SortBy;
  public filter = computed(() => this.filtersService.filter());

  public errorMessage = signal<string | null>(null);

  public updateUserForm: FormGroup = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(2)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(patterns.email),
      ],
    ],
  });

  constructor() {}

  ngOnInit(): void {
    this.paginationService.setPagination(1, 5);
    this.filtersService.resetFilters();
    this.getAllUsers();
    this.resetFormErrors();
  }

  public getAllUsers(): void {
    this.usersService
      .getAllUsers(
        this.paginationService.pagination(),
        this.filtersService.filter()
      )
      .subscribe({
        next: ({ next, prev, items }) => {
          this.users.set(items);
          this.paginationService.setPaginationButtons(!!next, !!prev);
        },
        error: (error) => this.hotToastService.error(error),
      });
  }

  public getUserById(user: User): void {
    this.currentUser.set(user);

    this.usersService.getUserById(this.currentUser()!.user_id).subscribe({
      next: (user) => this.updateUserForm.reset(user),
      error: (error) => this.hotToastService.error(error),
    });
  }

  public updateUser(): void {
    this.processing.update(() => true);
    this.usersService
      .updateUser(this.updateUserForm.value, this.currentUser()!.user_id)
      .subscribe({
        next: () => {
          this.getAllUsers();
          this.processing.update(() => false);
        },
        error: (error) => {
          this.errorMessage.set(error);
          this.hotToastService.error(error);
          this.processing.update(() => false);
        },
      });
  }

  public deleteUser(): void {
    this.processing.update(() => true);
    this.usersService.deleteUser(this.currentUser()!.user_id).subscribe({
      next: () => {
        this.getAllUsers();
        this.hotToastService.success('User deleted');
        this.processing.update(() => false);
      },
      error: (error) => {
        this.hotToastService.error(error);
        this.processing.update(() => false);
      },
    });
  }

  public applyFilter(filter: SortBy): void {
    this.filtersService.applyFilter(filter, { page: 1, limit: 5 });
    this.getAllUsers();
  }

  public searchCategory(query: string): void {
    this.filtersService.search(query, { page: 1, limit: 5 });
    this.getAllUsers();
  }

  public updatePage(value: number): void {
    this.paginationService.updatePage(value);
    this.getAllUsers();
  }

  public isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.updateUserForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.updateUserForm, field);
  }

  public resetForm(): void {
    this.updateUserForm.reset();
    this.resetFormErrors();
  }

  private resetFormErrors(): void {
    this.updateUserForm.valueChanges.subscribe(() => {
      this.errorMessage.set(null);
    });
  }
}
