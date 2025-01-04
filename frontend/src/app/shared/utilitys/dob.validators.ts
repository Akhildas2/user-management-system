import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function minimumAgeValidator(minAge: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const dob = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const isOldEnough = 
      age > minAge || 
      (age === minAge && today.getMonth() >= dob.getMonth() && today.getDate() >= dob.getDate());
    return isOldEnough ? null : { minAge: { value: minAge } };
  };
}

