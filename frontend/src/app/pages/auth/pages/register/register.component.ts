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
import { PATTERNS } from '../../../../core/constants';
import { HotToastService } from '@ngxpert/hot-toast';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styles: ``,
})
export class RegisterComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly hotToastService = inject(HotToastService);

  private readonly authService = inject(AuthService);
  private readonly validatorsService = inject(ValidatorsService);

  public errorMessage = signal<string | null>(null);

  public registerForm: FormGroup = this.fb.group({
    fullname: ['', [Validators.required, Validators.minLength(2)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    email: [
      '',
      [
        Validators.required,
        Validators.minLength(1),
        Validators.pattern(PATTERNS.email),
      ],
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(PATTERNS.password),
      ],
    ],
  });

  constructor() {}

  ngOnInit(): void {
    this.resetFormErrors();
  }

  public registerUser(): void {
    this.registerForm.disable();
    this.authService.registerUser(this.registerForm.value).subscribe({
      next: () => {
        this.router.navigateByUrl('auth/login');
        this.hotToastService.success('Registration successful! Welcome aboard');
      },
      error: (error) => {
        this.registerForm.enable();
        this.errorMessage.set(error);
      },
    });
  }

  public isInvalidField(field: string): boolean | null {
    return this.validatorsService.isInvalidField(this.registerForm, field);
  }

  public getFieldError(field: string): string | null {
    return this.validatorsService.getFieldError(this.registerForm, field);
  }

  private resetFormErrors(): void {
    this.registerForm.valueChanges.subscribe(() => {
      this.errorMessage.set(null);
    });
  }
}
