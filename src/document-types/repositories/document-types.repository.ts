import type { DocumentTypeDomain } from '../domain/document-type';

export interface CreateDocumentTypeData {
  type: string;
  label: string;
  schoolId: string;
}

export abstract class DocumentTypesRepository {
  abstract create(data: CreateDocumentTypeData): Promise<DocumentTypeDomain>;
  abstract findById(
    id: string,
    schoolId: string,
  ): Promise<DocumentTypeDomain | null>;
  abstract findByType(
    type: string,
    schoolId: string,
  ): Promise<DocumentTypeDomain | null>;
  abstract findManyBySchool(
    schoolId: string,
  ): Promise<DocumentTypeDomain[] | []>;
  abstract softDelete(id: string, schoolId: string): Promise<void>;
}
