import { Injectable } from '@nestjs/common';
import type {
  CreateStudentsDocumentData,
  StudentDocumentsRepository,
} from '../students-documents.repository';
import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import type { StudentDocumentDomain } from '@/student-documents/domain/student-document';
import type { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PrismaStudentDocumentsRepository implements StudentDocumentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(
    data: CreateStudentsDocumentData,
    tx?: TransactionClient,
  ): Promise<StudentDocumentDomain> {
    const client = tx ?? this.prisma;

    return client.studentDocument.create({
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
