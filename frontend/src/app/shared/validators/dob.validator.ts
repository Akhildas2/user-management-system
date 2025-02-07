import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minimumAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const dob = new Date(control.value);
    if (isNaN(dob.getTime())) {
      return { invalidDob: true };
    }
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const isOldEnough =
      age > minAge ||
      (age === minAge && today.getMonth() >= dob.getMonth() && today.getDate() >= dob.getDate());
    return isOldEnough ? null : { minAge: { value: minAge } };
  };
}

export function noNullOrStringNullValidator(control: AbstractControl): ValidationErrors | null {
  if (control.dirty && (control.value === null || control.value === '' || control.value === 'null')) {
    return { invalidField: true };
  }
  return null;
}