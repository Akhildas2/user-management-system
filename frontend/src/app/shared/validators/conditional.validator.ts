import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export function conditionalValidator(validators: ValidatorFn[]): ValidatorFn {
  return (control: AbstractControl) => {
    if (!control.value) {
      return null;
    }
    // CHANGED: Assign the composed validator to a variable
    const composedValidator = Validators.compose(validators);
    // CHANGED: Check that composedValidator is not null before calling it
    return composedValidator ? composedValidator(control) : null;
  };
}
