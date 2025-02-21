import {AbstractControl, ValidationErrors, ValidatorFn} from '@angular/forms';
import {DOCUMENT_FORM_CONTROLS} from '../features/documents/constants/document.constants';

export function dueDateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.parent) return null;

    const dateOfRegistration = control.parent.get(DOCUMENT_FORM_CONTROLS.DATE_OF_REGISTRATION)?.value;
    const dateOutgoingDocument = control.parent.get(DOCUMENT_FORM_CONTROLS.DATE_OUTGOING_DOCUMENT)?.value;
    const dueDate = control.value;

    if (!dueDate) return null;

    if (dateOfRegistration && dueDate <= dateOfRegistration) {
      return {dueDateInvalid1: true};
    }

    if (dateOutgoingDocument && dueDate <= dateOutgoingDocument) {
      return {dueDateInvalid2: true};
    }

    return null; // Валидно
  };
}
