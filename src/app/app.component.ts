import {Component} from '@angular/core';
import {DocumentsTableComponent} from './features/documents/components/documents-table/documents-table.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [
    DocumentsTableComponent
  ],
  standalone: true
})
export class AppComponent {


}
