import { GradeNotFoundError } from '../errors/grade-not-found.error';
import { InMemoryGradesRepository } from '../repositories/in-memory/in-memory-students.repository';
import { CreateGradeUseCase } from '../usecases/create-grade.use-case';
import { DeleteGradeUseCase } from '../usecases/delete-grade.use-case';

let repository: InMemoryGradesRepository;
let deleteUseCase: DeleteGradeUseCase;
let createUseCase: CreateGradeUseCase;

describe('DeleteGradeUseCase', () => {
  beforeEach(() => {
    repository = new InMemoryGradesRepository();
    deleteUseCase = new DeleteGradeUseCase(repository);
    createUseCase = new CreateGradeUseCase(repository);
  });

  it('should soft delete grade', async () => {
    const grade = await createUseCase.execute({
      name: '1a',
      order: 1,
      schoolId: 'school-1',
    });

    await deleteUseCase.execute(grade.id, 'school-1');

    expect(repository.grades[0].deletedAt).not.toBeNull();
  });

  it('should throw error when grade not found', async () => {
    await expect(() =>
      deleteUseCase.execute('not-existent', 'school-1'),
    ).rejects.toBeInstanceOf(GradeNotFoundError);
  });
});
