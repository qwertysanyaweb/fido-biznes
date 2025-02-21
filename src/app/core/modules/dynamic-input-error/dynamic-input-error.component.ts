import {Component, HostBinding, Input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {KeyValue, KeyValuePipe} from '@angular/common';
import {DynamicInputErrorMessagesPipe} from "./pipes/dynamic-input-error-messages.pipe";


@Component({
  selector: 'app-dynamic-input-error',
  template: `
    @if (errors) {
      @for (error of errors | keyvalue; track trackByFn) {
        {{ error.key | dynamicInputErrorMessage :error.value }}
      }
    }
  `,
  imports: [
    KeyValuePipe,
    DynamicInputErrorMessagesPipe
  ],
  standalone: true
})
export class DynamicInputErrorComponent {

  @HostBinding('class') hostClass = 'formGroup-error';

  @Input()
  errors: ValidationErrors | undefined | null = null;


  trackByFn(item: KeyValue<string, any>) {
    return item.key;
  }


}
