import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function minDateValidator(minDateField: string, errorLabel: string = 'minDateInvalid'): ValidatorFn {

  return (control: AbstractControl): ValidationErrors | null => {
    const formGroup = control.parent;
    if (!formGroup) return null;

    const minDateControl = formGroup.get(minDateField);
    if (!minDateControl) return null;

    const minDate = minDateControl.value;
    const currentDate = control.value;

    if (!minDate || !currentDate) return null;


    return currentDate >= minDate ? null : {[errorLabel]: true};
  };
}
