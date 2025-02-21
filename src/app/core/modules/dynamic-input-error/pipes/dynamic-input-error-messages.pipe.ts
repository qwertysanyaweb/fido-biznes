import {Inject, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {Subscription} from "rxjs";
import {VALIDATION_ERROR_MESSAGES} from "../../../tokens/validation-error-message.token";

@Pipe({
  name: 'dynamicInputErrorMessage',
  standalone: true,
  pure: false
})
export class DynamicInputErrorMessagesPipe implements PipeTransform, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  private subscription: Subscription | null = null;

  constructor(
    @Inject(VALIDATION_ERROR_MESSAGES) private readonly errorMessages: ValidationErrors,
  ) {
  }

  transform(key: string, errValue: string): string {
    if (!this.errorMessages[key]) {
      console.warn(`Не указано сообщение ошибки для ${key}`);
      return '';
    }

    return this.errorMessages[key](errValue);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

}
