import { DocumentTypeAlreadyExistsError } from '../errors/document-type-already-exists.error';
import { InMemoryDocumentTypeRepository } from '../repositories/in-memory-document-types.repository';
import { CreateDocumentTypeUseCase } from '../use-cases/create-document-type.use-case';

describe('Create Document Type Use-Case', () => {
  let repository: InMemoryDocumentTypeRepository;
  let sut: CreateDocumentTypeUseCase;

  const schoolId = 'school-1';
  const userId = 'user-1';

  beforeEach(() => {
    repository = new InMemoryDocumentTypeRepository();
    sut = new CreateDocumentTypeUseCase(repository);
  });

  it('should create a document type', async () => {
    const documentType = await sut.execute(
      { type: 'BI', label: 'Bilhete de Identidade' },
      { performedByUserId: userId, schoolId: schoolId },
    );

    expect(documentType.id).toBeDefined();
    expect(repository.items).toHaveLength(1);
    expect(repository.items[0].type).toBe('BI');
  });

  it('should not allow duplicate document type for same school', async () => {
    await sut.execute(
      { type: 'BI', label: 'Bilhete de Identidade' },
      { performedByUserId: userId, schoolId: schoolId },
    );

    await expect(() =>
      sut.execute(
        { type: 'BI', label: 'Bilhete de Identidade' },
        { performedByUserId: userId, schoolId: schoolId },
      ),
    ).rejects.toBeInstanceOf(DocumentTypeAlreadyExistsError);
  });

  it('should allow same document type for different schools', async () => {
    await sut.execute(
      { type: 'BI', label: 'Bilhete de Identidade' },
      { performedByUserId: userId, schoolId: schoolId },
    );

    const result = await sut.execute(
      { type: 'BI', label: 'Bilhete de Identidade' },
      { performedByUserId: userId, schoolId: 'school-2' },
    );
    expect(result).toBeDefined();
    expect(repository.items).toHaveLength(2);
  });
});
