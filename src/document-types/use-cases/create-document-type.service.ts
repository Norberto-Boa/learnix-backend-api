import { DocumentTypeAlreadyExistsError } from '../errors/document-type-already-exists.error';
import { DocumentTypesRepository } from '../repositories/document-types.repository';
interface CreateDocumetTypeRequest {
  type: string;
  label: string;
}

export class CreateDocumentTypeUseCase {
  constructor(private documentTypesRepository: DocumentTypesRepository) {}

  async execute(
    data: CreateDocumetTypeRequest,
    schoolId: string,
  ): Promise<DocumentType> {
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
