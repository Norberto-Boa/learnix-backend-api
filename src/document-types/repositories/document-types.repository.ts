import type { DocumentTypeDomain } from '../domain/document-type';

export interface CreateDocumentTypeData {
  type: string;
  label: string;
  schoolId: string;
}

export interface DocumentTypesRepository {
  create(data: CreateDocumentTypeData): Promise<DocumentTypeDomain>;
  findById(id: string, schoolId: string): Promise<DocumentTypeDomain>;
  findByType(type: string, schoolId: string): Promise<DocumentTypeDomain>;
  findManyBySchool(schoolId: string): Promise<DocumentTypeDomain[]>;
  softDelete(id: string, schoolId: string): Promise<void>;
}
