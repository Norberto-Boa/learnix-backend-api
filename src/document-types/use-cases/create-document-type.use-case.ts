import type { AuditContext } from '@/audit/domain/audit-context';
import { DocumentTypeAlreadyExistsError } from '../errors/document-type-already-exists.error';
import { DocumentTypesRepository } from '../repositories/document-types.repository';
import type { DocumentTypeDomain } from '../domain/document-type';
import { Injectable } from '@nestjs/common';
interface CreateDocumetTypeRequest {
  type: string;
  label: string;
}

@Injectable()
export class CreateDocumentTypeUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute(
    data: CreateDocumetTypeRequest,
    auditContext: AuditContext,
  ): Promise<DocumentTypeDomain> {
    const { schoolId } = auditContext;

    const doesDocumentTypeAlreadyExists =
      await this.documentTypesRepository.findByType(data.type, schoolId);

    if (doesDocumentTypeAlreadyExists) {
      throw new DocumentTypeAlreadyExistsError();
    }

    return this.documentTypesRepository.create({
      type: data.type,
      label: data.label,
      schoolId,
    });
  }
}
