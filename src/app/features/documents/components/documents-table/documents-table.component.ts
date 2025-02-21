import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButton, MatMiniFabButton} from '@angular/material/button';
import {DOCUMENT_FORM_CONTROLS} from '../../constants/document.constants';
import {DocumentsService} from '../../services/documents.service';
import {Document} from '../../interfaces/document.interface';
import {DatetimeService} from '../../../../core/services/datetime.service';
import {DialogModule} from '@angular/cdk/dialog';
import {MatIcon} from '@angular/material/icon';
import {CORRESPONDENT_TYPES} from '../../constants/reference.constants';
import {DocumentFormComponent} from '../document-form/document-form.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSort, MatSortHeader} from '@angular/material/sort';
import {Subscription} from 'rxjs';


@Component({
  selector: 'app-documents-table',
  imports: [MatTableModule, MatButton, DialogModule, MatIcon, MatMiniFabButton, MatSort, MatSortHeader],
  standalone: true,
  templateUrl: './documents-table.component.html',
  styleUrl: './documents-table.component.scss'
})
export class DocumentsTableComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  protected readonly DOCUMENT_FORM_CONTROLS = DOCUMENT_FORM_CONTROLS;

  correspondentTypes = CORRESPONDENT_TYPES;

  public documents: Document[] = [];

  @ViewChild(MatSort) sort!: MatSort;

  public dataSource: MatTableDataSource<Document> = new MatTableDataSource<Document>([]);

  displayedColumns: string[] = [
    DOCUMENT_FORM_CONTROLS.ATTACHMENT,
    DOCUMENT_FORM_CONTROLS.REGISTRATION_NUMBER,
    DOCUMENT_FORM_CONTROLS.DATE_OF_REGISTRATION,
    DOCUMENT_FORM_CONTROLS.OUTGOING_DOCUMENT_NUMBER,
    DOCUMENT_FORM_CONTROLS.DATE_OUTGOING_DOCUMENT,
    DOCUMENT_FORM_CONTROLS.CORRESPONDENT,
    DOCUMENT_FORM_CONTROLS.SUBJECT,
    'control'
  ];

  constructor(
    private readonly documentsService: DocumentsService,
    private readonly datetimeService: DatetimeService,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.getDocumentsList();
  }

  public getDocumentsList(): void {
    this.subscriptions.add(
      this.documentsService._getDocumentsList$.subscribe((documents) => {
        this.dataSource.data = documents;
        this.dataSource.sort = this.sort;
        this.setupCustomSort();
      })
    )
  }

  private setupCustomSort(): void {
    this.dataSource.sortingDataAccessor = (item: Document, property: string): string | number => {
      switch (property) {
        case DOCUMENT_FORM_CONTROLS.DATE_OF_REGISTRATION:
          return item[DOCUMENT_FORM_CONTROLS.DATE_OF_REGISTRATION]
            ? new Date(item[DOCUMENT_FORM_CONTROLS.DATE_OF_REGISTRATION]).getTime()
            : 0;
        case DOCUMENT_FORM_CONTROLS.DATE_OUTGOING_DOCUMENT:
          return item[DOCUMENT_FORM_CONTROLS.DATE_OUTGOING_DOCUMENT]
            ? new Date(item[DOCUMENT_FORM_CONTROLS.DATE_OUTGOING_DOCUMENT]!).getTime()
            : 0;
        case DOCUMENT_FORM_CONTROLS.CORRESPONDENT:
          return this.getCorrespondentType(item[DOCUMENT_FORM_CONTROLS.CORRESPONDENT]) || '';
        case DOCUMENT_FORM_CONTROLS.ATTACHMENT:
          return item[DOCUMENT_FORM_CONTROLS.ATTACHMENT]?.fileName || '';
        default:
          const value = item[property as keyof Document];
          if (value === null || value === undefined) return '';
          if (typeof value === 'boolean') return value ? 1 : 0;
          if (value instanceof Date) return value.getTime();
          if (typeof value === 'object') return JSON.stringify(value);
          return value as string | number;
      }
    };
  }

  public convertDate(date: Date): string {
    return this.datetimeService.convertDate(date);
  }

  public createDocument(): void {
    this.dialog.open(DocumentFormComponent, {maxWidth: 800});
  }

  public removeDocument(id: number): void {
    this.documentsService.removeDocument(id);
  }

  public getCorrespondentType(id: number): string {
    return this.correspondentTypes.find((correspondent) => correspondent.id === id)?.label || '';
  }

  public editDocument(id: number): void {
    this.dialog.open(DocumentFormComponent, {data: {id}, maxWidth: 800});
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
