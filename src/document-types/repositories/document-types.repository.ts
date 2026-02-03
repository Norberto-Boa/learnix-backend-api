import type { DocumentTypeDomain } from '../domain/document-type';

export interface CreateDocumentTypeData {
  type: string;
  label: string;
  schoolId: string;
}

export interface DocumentTypesRepository {
  create(data: CreateDocumentTypeData): Promise<DocumentTypeDomain>;
  findById(id: string, schoolId: string): Promise<DocumentTypeDomain | null>;
  findByType(
    type: string,
    schoolId: string,
  ): Promise<DocumentTypeDomain | null>;
  findManyBySchool(schoolId: string): Promise<DocumentTypeDomain[] | []>;
  softDelete(id: string, schoolId: string): Promise<void>;
}
