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

  async findById(
    id: string,
    schoolId: string,
  ): Promise<DocumentTypeDomain | null> {
    return (
      this.items.find(
        (item) =>
          item.id === id && item.schoolId === schoolId && !item.deletedAt,
      ) ?? null
    );
  }

  async findByType(
    type: string,
    schoolId: string,
  ): Promise<DocumentTypeDomain | null> {
    return (
      this.items.find(
        (item) =>
          item.type === type && item.schoolId === schoolId && !item.deletedAt,
      ) ?? null
    );
  }

  async findManyBySchool(schoolId: string): Promise<DocumentTypeDomain[] | []> {
    return this.items.filter((item) => {
      if (item.schoolId !== schoolId) return false;
      if (item.deletedAt) return false;
      return true;
    });
  }

  async softDelete(id: string, schoolId: string): Promise<void> {
    const item = this.items.find(
      (item) => item.id === id && item.schoolId === schoolId,
    );

    if (item && !item.deletedAt) {
      item.deletedAt = new Date();
    }
  }
}
