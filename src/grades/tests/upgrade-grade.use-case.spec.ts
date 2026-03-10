import { GradeAlreadyExistsError } from '../errors/grade-already-exists.error';
import { InMemoryGradesRepository } from '../repositories/in-memory/in-memory-students.repository';
import { CreateGradeUseCase } from '../usecases/create-grade.use-case';
import { UpdateGradeUseCase } from '../usecases/update-grade.use-case';

let repository: InMemoryGradesRepository;
let updateUseCase: UpdateGradeUseCase;
let createUseCase: CreateGradeUseCase;

describe('UpdateGradeUseCase', () => {
  beforeEach(() => {
    repository = new InMemoryGradesRepository();
    updateUseCase = new UpdateGradeUseCase(repository);
    createUseCase = new CreateGradeUseCase(repository);
  });

  it('should update grade', async () => {
    const grade = await createUseCase.execute({
      name: '1a',
      order: 1,
      schoolId: 'school-1',
    });

    const updated = await updateUseCase.execute(grade.id, 'school-1', {
      name: '2a',
    });

    expect(updated?.name).toBe('2a');
  });

  it('Should not accept update if name already exists', async () => {
    await createUseCase.execute({
      name: '1a',
      order: 1,
      schoolId: 'school-1',
    });

    await expect(() =>
      createUseCase.execute({
        name: '1a',
        order: 1,
        schoolId: 'school-1',
      }),
    ).rejects.toBeInstanceOf(GradeAlreadyExistsError);
  });
});
