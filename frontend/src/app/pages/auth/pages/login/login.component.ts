import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService, ValidatorsService } from '../../../../core/services';
import { CommonModule } from '@angular/common';
import { patterns } from '../../../../core/constants';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styles: ``,
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  private readonly authService = inject(AuthService);
  private readonly validatorsService = inject(ValidatorsService);

  public errorMessage = signal<string | null>(null);

  public loginForm: FormGroup = this.fb.group({
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(patterns.email),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(patterns.password),
      ],
    ],
  });

  constructor() {}

  ngOnInit(): void {
    this.resetFormErrors();
  }

  public loginUser(): void {
    this.authService.loginUser(this.loginForm.value).subscribe({
      next: () => this.router.navigateByUrl('/'),
      error: (error) => this.errorMessage.set(error),
    });
  }

  public isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.loginForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.loginForm, field);
  }

  private resetFormErrors(): void {
    this.loginForm.valueChanges.subscribe(() => {
      this.errorMessage.set(null);
    });
  }
}
