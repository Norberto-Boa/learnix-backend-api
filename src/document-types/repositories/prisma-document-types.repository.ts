import { PrismaService } from '@/prisma/prisma.service';
import type {
  CreateDocumentTypeData,
  DocumentTypesRepository,
} from './document-types.repository';
import type { DocumentTypeDomain } from '../domain/document-type';
import { Prisma } from '@/generated/prisma/client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PrismaDocumentTypesRepository implements DocumentTypesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    data: CreateDocumentTypeData,
    tx?: Prisma.TransactionClient,
  ): Promise<DocumentTypeDomain> {
    const client = tx ?? this.prisma;

    const documentType = await client.documentType.create({
      data: {
        type: data.type,
        label: data.label,
        schoolId: data.schoolId,
      },
    });

    return documentType;
  }

  findById(
    id: string,
    schoolId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<DocumentTypeDomain | null> {
    const client = tx ?? this.prisma;

    return client.documentType.findFirst({
      where: {
        id,
        schoolId,
      },
    });
  }

  findByType(
    type: string,
    schoolId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<DocumentTypeDomain | null> {
    const client = tx ?? this.prisma;

    return client.documentType.findFirst({
      where: {
        type,
        schoolId,
      },
    });
  }

  findManyBySchool(
    schoolId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<DocumentTypeDomain[]> {
    const client = tx ?? this.prisma;
    return client.documentType.findMany({
      where: {
        schoolId,
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  async softDelete(
    id: string,
    schoolId: string,
    tx?: Prisma.TransactionClient,
  ): Promise<void> {
    const client = tx ?? this.prisma;

    await client.documentType.updateMany({
      where: {
        id,
        schoolId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
