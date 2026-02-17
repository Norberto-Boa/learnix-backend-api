import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import type { StudentDocumentDomain } from '../domain/student-document';
import type { DbContext } from '@/prisma/shared/db-context';

export interface CreateStudentsDocumentData {
  studentId: string;
  documentTypeId: string;
  documentNumber: string;
  fileUrl?: string | null;
  schoolId: string;
}

export abstract class StudentDocumentsRepository {
  abstract save(
    data: CreateStudentsDocumentData,
    db?: DbContext,
  ): Promise<StudentDocumentDomain>;
  abstract findTypeAndNumber(
    documentTypeId: string,
    documentNumber: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDocumentDomain | null>;
  abstract findByStudentId(
    studentId: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDocumentDomain[] | null>;
  abstract delete(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<void>;
}
