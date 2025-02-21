import {Component, Inject, inject, OnDestroy, OnInit, Optional} from '@angular/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSelectModule} from '@angular/material/select';
import {DatepickerComponent} from '../../../../components/datepicker/datepicker.component';
import {MatCheckbox} from '@angular/material/checkbox';
import {CORRESPONDENT_TYPES, DELIVERY_METHODS} from '../../constants/reference.constants';
import {DOCUMENT_FORM_CONTROLS} from '../../constants/document.constants';
import {registrationNumberValidator} from '../../../../validators/registration-number.validator';
import {
  DynamicValidatorMessageDirective
} from '../../../../core/modules/dynamic-input-error/directives/dynamic-validator-message.directive';
import {minDateValidator} from '../../../../validators/min-date.validator';
import {debounceTime, Subscription} from 'rxjs';
import {FileUploadComponent} from '../../../../components/file-uploader/file-uploader.component';
import {DocumentsService} from '../../services/documents.service';
import {DialogModule, DialogRef} from '@angular/cdk/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {dueDateValidator} from '../../../../validators/due-date.validator';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-document-form',
  imports: [MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule, MatIconModule, MatDatepickerModule, MatSelectModule, DatepickerComponent, MatCheckbox, ReactiveFormsModule, DynamicValidatorMessageDirective, FileUploadComponent, DialogModule],
  templateUrl: './document-form.component.html',
  styleUrl: './document-form.component.scss',
  standalone: true,
})
export class DocumentFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  deliveryMethods = DELIVERY_METHODS;

  correspondentTypes = CORRESPONDENT_TYPES;

  form: FormGroup;

  maxDate: Date = new Date();

  minDateOutgoing?: Date;

  maxDateOutgoing?: Date;

  dialogRef = inject<DialogRef<string>>(DialogRef<string>);

  edit: boolean = false;

  private _snackBar = inject(MatSnackBar);

  constructor(
    @Optional() @Inject(MAT_DIALOG_DATA) public data: null | {
      id: number;
    },
    private readonly formBuilder: FormBuilder,
    private readonly documentsService: DocumentsService,
  ) {
    this.form = this.formBuilder.group({
      [DOCUMENT_FORM_CONTROLS.ID]: [null],
      [DOCUMENT_FORM_CONTROLS.REGISTRATION_NUMBER]: [null, [Validators.required, registrationNumberValidator()]],
      [DOCUMENT_FORM_CONTROLS.DATE_OF_REGISTRATION]: [null, [Validators.required]],
      [DOCUMENT_FORM_CONTROLS.OUTGOING_DOCUMENT_NUMBER]: [null, [registrationNumberValidator()]],
      [DOCUMENT_FORM_CONTROLS.DATE_OUTGOING_DOCUMENT]: [null, [minDateValidator(DOCUMENT_FORM_CONTROLS.DATE_OF_REGISTRATION, 'dueData')]],
      [DOCUMENT_FORM_CONTROLS.DELIVERY]: [null],
      [DOCUMENT_FORM_CONTROLS.CORRESPONDENT]: [null, [Validators.required]],
      [DOCUMENT_FORM_CONTROLS.SUBJECT]: [null, [Validators.required, Validators.maxLength(100)]],
      [DOCUMENT_FORM_CONTROLS.DESCRIPTION]: [null, [Validators.maxLength(1000)]],
      [DOCUMENT_FORM_CONTROLS.DUE_DATE]: [null, [dueDateValidator()]],
      [DOCUMENT_FORM_CONTROLS.ACCESS]: [false],
      [DOCUMENT_FORM_CONTROLS.CONTROL]: [false],
      [DOCUMENT_FORM_CONTROLS.ATTACHMENT]: [null],
    });

    let doc = this.documentsService.getDocument(this.data?.id);

    if (this.data?.id) {
      if (doc) {
        this.edit = true;
        this.form.setValue(doc);
      } else {
        this._snackBar.open('Документ не найден', 'Понятно', {
          horizontalPosition: 'center',
          verticalPosition: "bottom",
        });
      }
    }
  }

  protected readonly DOCUMENT_FORM_CONTROLS = DOCUMENT_FORM_CONTROLS;

  ngOnInit() {
    this.subscriptions.add(
      this.form
        .get(DOCUMENT_FORM_CONTROLS.DATE_OF_REGISTRATION)
        ?.valueChanges.pipe((debounceTime(500))).subscribe((value) => {
        this.minDateOutgoing = value;
        this.form.get(DOCUMENT_FORM_CONTROLS.DUE_DATE)?.updateValueAndValidity();
        this.form.get(DOCUMENT_FORM_CONTROLS.DATE_OUTGOING_DOCUMENT)?.updateValueAndValidity();
      })
    )
    this.subscriptions.add(
      this.form
        .get(DOCUMENT_FORM_CONTROLS.DATE_OUTGOING_DOCUMENT)
        ?.valueChanges.pipe((debounceTime(500))).subscribe((value) => {
        this.maxDateOutgoing = value;
        this.form.get(DOCUMENT_FORM_CONTROLS.DUE_DATE)?.updateValueAndValidity();
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  public submit(): void {
    if (this.form.valid) {
      this.documentsService.setDocumentsList(this.form.value);
      this.dialogRef.close();
    } else {
      Object.keys(this.form.controls).forEach(field => {
        const control = this.form.get(field);
        if (control?.errors?.['required']) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });
    }
  }
}
