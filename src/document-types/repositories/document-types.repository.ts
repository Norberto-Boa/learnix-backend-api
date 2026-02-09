import type { TransactionClient } from '@/generated/prisma/internal/prismaNamespace';
import type { DocumentTypeDomain } from '../domain/document-type';

export interface CreateDocumentTypeData {
  type: string;
  label: string;
  schoolId: string;
}

export abstract class DocumentTypesRepository {
  abstract create(
    data: CreateDocumentTypeData,
    tx?: TransactionClient,
  ): Promise<DocumentTypeDomain>;
  abstract findById(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<DocumentTypeDomain | null>;
  abstract findByType(
    type: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<DocumentTypeDomain | null>;
  abstract findManyBySchool(
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<DocumentTypeDomain[] | []>;
  abstract softDelete(
    id: string,
    schoolId: string,
    tx?: TransactionClient,
  ): Promise<void>;
}
