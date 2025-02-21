import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';

export function registrationNumberValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value?.trim();

    if (!value) {
      return null;
    }

    const hasNumber = /\d/.test(value);
    const hasLetter = /[a-zA-Zа-яА-Я]/.test(value);

    if (!hasNumber) {
      return {registrationNumberValidator: true};
    }

    if (!hasLetter) {
      return {registrationNumberValidator: true};
    }

    return null;
  };
}
