export interface StudentDocumentDomain {
  id: string;
  studentId: string;
  documentTypeId: string;
  documentNumber: string;
  fileUrl?: string | null;
  schoolId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}
