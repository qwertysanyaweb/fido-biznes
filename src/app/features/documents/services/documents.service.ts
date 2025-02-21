import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Document} from '../interfaces/document.interface';

@Injectable({
  providedIn: 'root'
})
export class DocumentsService {

  public readonly _getDocumentsList$: BehaviorSubject<Document[]> = new BehaviorSubject<Document[]>([]);

  public setDocumentsList(document: Document): void {
    if (!document.id) {
      const currentDocuments = this._getDocumentsList$.value;
      const maxId = currentDocuments.length > 0 ? Math.max(...currentDocuments.map(d => d.id || 0)) : 0;
      const newDocument = {...document, id: document.id ?? maxId + 1};
      this._getDocumentsList$.next([newDocument, ...currentDocuments]);
    } else {
      this.updateDocument(document);
    }
  }

  public removeDocument(id: number): void {
    this._getDocumentsList$.next(
      this._getDocumentsList$.value.filter(document => document.id !== id)
    );
  }

  public getDocument(id: number | undefined): Document | undefined {
    return this._getDocumentsList$.value.find(document => document.id === id);
  }

  public updateDocument(document: Document): void {
    const currentList = this._getDocumentsList$.value;
    const updatedList = currentList.map(item =>
      item.id === document.id ? document : item
    );
    this._getDocumentsList$.next(updatedList);
  }
}
