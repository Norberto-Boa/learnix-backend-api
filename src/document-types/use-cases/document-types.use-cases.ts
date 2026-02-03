import type { AuditContext } from '@/audit/domain/audit-context';
import type { DocumentType } from '../domain/document-type';

export interface CreateDocumentTypeUseCase {
  execute(
    data: { type: string; label: string },
    auditContext: AuditContext,
  ): Promise<DocumentType>;
}

export interface ListDocumentTypesUseCase {
  execute(schoolId: string): Promise<DocumentType[]>;
}

export interface GetDocumentTypeByIdUseCase {
  execute(id: string, schoolId: string): Promise<DocumentType>;
}

export interface DeleteDocumentTypeUseCase {
  execute(id: string, schoolId: string): Promise<void>;
}
