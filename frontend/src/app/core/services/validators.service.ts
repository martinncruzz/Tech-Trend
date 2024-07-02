import { FormGroup } from '@angular/forms';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ValidatorsService {
  public isInvalidField(form: FormGroup, field: string): boolean | null {
    return form.controls[field].errors && form.controls[field].touched;
  }

  public getFieldError(form: FormGroup, field: string): string | null {
    if (!form.controls[field]) return null;

    const errors = form.controls[field].errors || {};
    const titleCaseField = field.charAt(0).toUpperCase() + field.slice(1);

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return `${titleCaseField} is required`;
        case 'max':
          return `Quantity cannot exceed available stock (${errors['max'].max})`;
        case 'min':
          return `Invalid value`;
        case 'minlength':
          return `Minimum ${errors['minlength'].requiredLength} characters `;
        case 'pattern':
          if (field === 'password') {
            return `Invalid format (must have an uppercase, lowercase letter and a number)`;
          }
          return `Invalid ${field} format`;
      }
    }

    return null;
  }
}
