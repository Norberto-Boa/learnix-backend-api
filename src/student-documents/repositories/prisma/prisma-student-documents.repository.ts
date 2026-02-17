import { Injectable } from '@nestjs/common';
import type {
  CreateStudentsDocumentData,
  StudentDocumentsRepository,
} from '../students-documents.repository';
import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import type { StudentDocumentDomain } from '@/student-documents/domain/student-document';
import { PrismaService } from '@/prisma/prisma.service';
import { error } from 'console';
import type { DbContext } from '@/prisma/shared/db-context';

@Injectable()
export class PrismaStudentDocumentsRepository implements StudentDocumentsRepository {
  constructor(private prisma: PrismaService) {}

  async save(
    data: CreateStudentsDocumentData,
    db?: DbContext,
  ): Promise<StudentDocumentDomain> {
    const client = db ?? this.prisma;

    return await client.studentDocument.create({
      data,
    });
  }

  async findByStudentId(
    studentId: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDocumentDomain[] | null> {
    const client = tx ?? this.prisma;

    return await client.studentDocument.findMany({
      where: { studentId, schoolId },
    });
  }

  async findTypeAndNumber(
    documentTypeId: string,
    documentNumber: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<StudentDocumentDomain | null> {
    const client = tx ?? this.prisma;

    return await client.studentDocument.findFirst({
      where: {
        documentTypeId,
        documentNumber,
        schoolId,
      },
    });
  }

  async delete(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    await client.studentDocument.update({
      where: { id, schoolId },
      data: { deletedAt: new Date() },
    });
  }
}
