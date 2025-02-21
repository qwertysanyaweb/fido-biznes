import {Component, inject, Inject, Optional} from '@angular/core';
import {CORRESPONDENT_TYPES, DELIVERY_METHODS} from '../../constants/reference.constants';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DocumentsService} from '../../services/documents.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {DialogRef} from '@angular/cdk/dialog';
import {Document} from '../../interfaces/document.interface';
import {JsonPipe} from '@angular/common';
import {DOCUMENT_FORM_CONTROLS} from '../../constants/document.constants';
import {DatepickerComponent} from '../../../../components/datepicker/datepicker.component';
import {
  DynamicValidatorMessageDirective
} from '../../../../core/modules/dynamic-input-error/directives/dynamic-validator-message.directive';
import {FileUploadComponent} from '../../../../components/file-uploader/file-uploader.component';
import {MatButton} from '@angular/material/button';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatInput} from '@angular/material/input';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {ReactiveFormsModule} from '@angular/forms';
import {DatetimeService} from '../../../../core/services/datetime.service';

@Component({
  selector: 'app-document-print',
  imports: [
    JsonPipe,
    DatepickerComponent,
    DynamicValidatorMessageDirective,
    FileUploadComponent,
    MatButton,
    MatCheckbox,
    MatFormField,
    MatInput,
    MatLabel,
    MatOption,
    MatSelect,
    ReactiveFormsModule
  ],
  standalone: true,
  templateUrl: './document-print.component.html',
  styleUrl: './document-print.component.scss'
})
export class DocumentPrintComponent {
  deliveryMethods = DELIVERY_METHODS;

  correspondentTypes = CORRESPONDENT_TYPES;

  private _snackBar = inject(MatSnackBar);

  dialogRef = inject<DialogRef<string>>(DialogRef<string>);

  document!: Document;

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: null | {
      id: number;
    },
    private readonly documentsService: DocumentsService,
    private readonly datetimeService: DatetimeService
  ) {

    let doc = this.documentsService.getDocument(this.data?.id);

    if (doc) {
      this.document = doc;
    } else {
      this.dialogRef.close();
      this._snackBar.open('Документ не найден', 'Понятно', {
        horizontalPosition: 'center',
        verticalPosition: "bottom",
      });
    }
  }

  public convertDate(date: Date | undefined): string {
    return date ? this.datetimeService.convertDate(date) : '';
  }

  public getReferenceValue(id: number | undefined, references: { id: number; label: string }[]): string {
    return references.find((correspondent) => correspondent.id === id)?.label || '';
  }

  protected readonly DOCUMENT_FORM_CONTROLS = DOCUMENT_FORM_CONTROLS;
}
