import { randomUUID } from 'crypto';
import type { DocumentTypeDomain } from '../domain/document-type';
import type {
  CreateDocumentTypeData,
  DocumentTypesRepository,
} from './document-types.repository';

export class InMemoryDocumentTypeRepository implements DocumentTypesRepository {
  public items: DocumentTypeDomain[] = [];

  async create(data: CreateDocumentTypeData): Promise<DocumentTypeDomain> {
    const documentType: DocumentTypeDomain = {
      id: randomUUID(),
      type: data.type,
      label: data.label,
      schoolId: data.schoolId,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    this.items.push(documentType);

    return documentType;
  }
}
