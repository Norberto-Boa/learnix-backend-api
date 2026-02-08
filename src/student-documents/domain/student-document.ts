export interface StudentDocumentDomain {
  id: string;
  studentId: string;
  documentTypeId: string;
  documentNumber: string;
  filUrl?: string | null;
  schoolId: string;
  createdAt: Date;
  updated: Date;
  deletedAt: Date | null;
}
