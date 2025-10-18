import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static MatchValidator(source: string, target: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const sourceCtrl = control.get(source);
      const targetCtrl = control.get(target);

      return sourceCtrl && targetCtrl && sourceCtrl.value !== targetCtrl.value
        ? { mismatch: true }
        : null;
    };
  }

  static MaxDigitsValidator(maxDigits: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      // If value is null or empty, skip
      if (value === null || value === undefined || value === '') {
        return null;
      }

      // Convert to string and remove decimal if present
      const stringValue = value.toString().split('.')[0]; // Only count digits before decimal

      // Check number of digits
      return stringValue.length > maxDigits ? { maxDigits: true } : null;
    };
  }

   static DoseWithUnit(): ValidatorFn {
    const num = String.raw`\d+(?:[.,]\d{1,2})?`;
    const unit = String.raw`(?:ml|g|l|cc)`;
    const denom = String.raw`(?:\/\s*(?:l|m(?:\u00B2|2)))?`; // /L or /m² (/m2)
    const pattern = new RegExp(String.raw`^\s*${num}\s*${unit}\s*${denom}\s*$`, 'i');

    return (control: AbstractControl): ValidationErrors | null => {
      const v = (control.value ?? '').toString().trim();
      if (!v) return null; 
      return pattern.test(v) ? null : { doseFormat: true };
    };
  }

  
}