export interface CreateDocumentTypeData {
  type: string;
  label: string;
  schoolId: string;
}

export interface DocumentTypesRepository {
  create(data: CreateDocumentTypeData): Promise<DocumentType>;
  findById(id: string, schoolId: string): Promise<DocumentType>;
  findByType(type: string, schoolId: string): Promise<DocumentType>;
  findManyBySchool(schoolId: string): Promise<DocumentType[]>;
  softDelete(id: string, schoolId: string): Promise<void>;
}
