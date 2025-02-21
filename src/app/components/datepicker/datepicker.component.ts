import {Component, forwardRef, inject, Input} from '@angular/core';
import {ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerInputEvent, MatDatepickerModule} from '@angular/material/datepicker';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {
  DynamicValidatorMessageDirective
} from '../../core/modules/dynamic-input-error/directives/dynamic-validator-message.directive';

@Component({
  selector: 'app-datepicker',
  standalone: true,
  imports: [
    MatFormFieldModule, MatInputModule, MatDatepickerModule, MatButtonModule, MatIconModule, ReactiveFormsModule, DynamicValidatorMessageDirective
  ],
  template: `
    <mat-form-field class="example-full-width">
      <mat-label>{{ label }}</mat-label>
      <input matInput [matDatepicker]="picker" [required]="required" [matDatepickerFilter]="dateFilter"
             [formControlName]="formControlName"
             (dateChange)="onDateChange($event)" appDynamicValidatorMessage>
      <mat-datepicker-toggle matIconSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DatepickerComponent),
    multi: true
  }],
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, 4),
    },
  ],
})
export class DatepickerComponent implements ControlValueAccessor {
  @Input() label: string = 'Выберите дату';
  @Input() required: boolean = false;
  @Input() formControlName!: string;
  @Input() maxDate?: Date;
  @Input() minDate?: Date;

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;

    if (this.minDate && !this.maxDate) {
      return date >= this.minDate;
    }

    if (!this.minDate && this.maxDate) {
      return date <= this.maxDate;
    }

    if (this.minDate && this.maxDate) {
      return date >= this.minDate && date <= this.maxDate;
    }

    return true;
  };


  private _onChange = (value: any) => {
  };
  private _onTouched = () => {
  };

  writeValue(value: any): void {
    this._onChange(value);
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  onDateChange(event: MatDatepickerInputEvent<Date>): void {
    this._onChange(event.value);
    this._onTouched();
  }
}

