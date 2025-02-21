export interface Document {
  id: number;
  registration_number: string;
  date_of_registration: Date;
  outgoing_document_number: string;
  date_outgoing_document?: Date;
  delivery?: number;
  correspondent: number;
  subject: string;
  description: string;
  due_date?: Date;
  access: boolean;
  control: boolean;
  attachment?: AttachmentDocument;
}

export interface AttachmentDocument {
  fileName: string;
  fileDate: string;
}
