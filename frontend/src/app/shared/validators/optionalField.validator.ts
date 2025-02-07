import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function optionalFieldsRequiredValidator(optionalControlNames: string[]): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const controls = optionalControlNames.map(name => group.get(name));

    const isAnyFieldFilled = controls.some(control => control?.value !== null && control?.value !== undefined && control?.value !== '');

    if (!isAnyFieldFilled) {
      return null;
    }

    const allFilled = controls.every(control => control?.value !== null && control?.value !== undefined && control?.value !== '');

    return allFilled ? null : { incompleteOptionalFields: true };
  };
}

