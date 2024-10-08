import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  // Email validator - this uses the built-in Angular Validators.email for validation
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Don't validate empty values (use required validator if needed)
      }

      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailPattern.test(value) ? null : { invalidEmail: true };
    };
  }

  // Phone number validator (international format with optional + sign)
  static phone_number(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // Don't validate empty values (use required validator if needed)
      }

      const phone_numberPattern = /^\+?[1-9]\d{1,14}$/; // E.164 phone number format
      return phone_numberPattern.test(value) ? null : { invalidphone_number: true };
    };
  }
}