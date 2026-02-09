import { randomUUID } from 'crypto';
import type { StudentDocumentDomain } from '../domain/student-document';
import type {
  CreateStudentsDocumentData,
  StudentDocumentsRepository,
} from './students-documents.repository';
import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';

export class InMemoryStudentDocumentsRepository implements StudentDocumentsRepository {
  public items: StudentDocumentDomain[] = [];

  async save(data: CreateStudentsDocumentData): Promise<StudentDocumentDomain> {
    const document: StudentDocumentDomain = {
      id: randomUUID(),
      studentId: data.studentId,
      documentTypeId: data.documentTypeId,
      documentNumber: data.documentNumber,
      fileUrl: data.fileUrl ?? null,
      schoolId: data.schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(document);

    return document;
  }

  async findTypeAndNumber(
    documentTypeId: string,
    documentNumber: string,
    schoolId: string,
  ): Promise<StudentDocumentDomain | null> {
    const document = this.items.find(
      (item) =>
        item.documentTypeId === documentTypeId &&
        item.documentNumber === documentNumber &&
        item.schoolId === schoolId,
    );
    return document ?? null;
  }

  async findByStudentId(
    studentId: string,
    schoolId: string,
  ): Promise<StudentDocumentDomain[] | null> {
    const document = this.items.filter(
      (item) => item.studentId === studentId && item.schoolId === schoolId,
    );

    return document;
  }

  async delete(id: string, schoolId: string): Promise<void> {
    const document = this.items.find(
      (item) => item.id === id && item.schoolId === schoolId,
    );

    if (document && !document.deletedAt) {
      document.deletedAt = new Date();
    }
  }
}
