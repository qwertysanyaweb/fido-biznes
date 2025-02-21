import {Component, forwardRef, inject, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlContainer, ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';

export const ERROR_MESSAGES: { [key: string]: (args?: any) => string } = {
  required: () => 'Поле обязательно для заполнения',
  invalidFormat: () => 'Недопустимый формат.',
  fileTooLarge: () => 'Размер файла превышает 1Мб.',
  invalidFormatAndSize: () => 'Недопустимый формат и размер файла.'
};

@Component({
  selector: 'app-file-upload',
  standalone: true,
  imports: [
    CommonModule, MatButtonModule, MatIconModule, ReactiveFormsModule
  ],
  template: `
    <div class="file-upload-container">
      <div class="file-upload-info" *ngIf="fileData; else uploadButton">
        <a [href]="fileData.fileBase64" download="{{ fileData.fileName }}">{{ fileData.fileName }}</a>
        <button mat-icon-button (click)="removeFile()" type="button">
          <mat-icon>delete</mat-icon>
        </button>
      </div>

      <ng-template #uploadButton>
        <button mat-button type="button" (click)="fileInput.click()">
          <mat-icon>attach_file</mat-icon>
          Выбрать файл
        </button>
        <input type="file" (change)="onFileSelected($event)" #fileInput hidden>
      </ng-template>

      <div *ngIf="errorMessage" class="error-message">{{ errorMessage }}</div>
    </div>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileUploadComponent),
    multi: true
  }],
  viewProviders: [{
    provide: ControlContainer,
    useFactory: () => inject(ControlContainer, 4),
  }]
})
export class FileUploadComponent implements ControlValueAccessor {
  @Input() label: string = 'Прикрепите файл';
  @Input() formControlName!: string;
  errorMessage: string | null = null;
  fileData: { fileName: string; fileBase64: string } | null = null;
  private allowedFormats = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  private maxSize = 1 * 1024 * 1024; // 1MB

  private _onChange = (value: any) => {
  };
  private _onTouched = () => {
  };

  writeValue(value: any): void {
    this.fileData = value;
  }

  registerOnChange(fn: any): void {
    this._onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this._onTouched = fn;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const selectedFile = input.files[0];
    const isValidFormat = this.allowedFormats.includes(selectedFile.type);
    const isValidSize = selectedFile.size <= this.maxSize;

    if (!isValidFormat && !isValidSize) {
      this.errorMessage = ERROR_MESSAGES['invalidFormatAndSize']();
    } else if (!isValidFormat) {
      this.errorMessage = ERROR_MESSAGES['invalidFormat']();
    } else if (!isValidSize) {
      this.errorMessage = ERROR_MESSAGES['fileTooLarge']();
    } else {
      this.errorMessage = null;
      this.convertFileToBase64(selectedFile);
    }
    this._onTouched();
  }

  private convertFileToBase64(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.fileData = {fileName: file.name, fileBase64: reader.result as string};
      this._onChange(this.fileData);
    };
  }

  removeFile(): void {
    this.fileData = null;
    this._onChange(null);
  }
}
