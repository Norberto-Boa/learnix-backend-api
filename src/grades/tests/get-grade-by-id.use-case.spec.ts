import { InMemoryGradesRepository } from '../repositories/in-memory/in-memory-students.repository';
import { CreateGradeUseCase } from '../usecases/create-grade.use-case';
import { GetGradeByIdUseCase } from '../usecases/get-grade-by-id.usecase';

let repository: InMemoryGradesRepository;
let getUseCase: GetGradeByIdUseCase;
let createUseCase: CreateGradeUseCase;

describe('GetGradeByIdUseCase', () => {
  beforeEach(() => {
    repository = new InMemoryGradesRepository();
    getUseCase = new GetGradeByIdUseCase(repository);
    createUseCase = new CreateGradeUseCase(repository);
  });

  it('should get grade by id', async () => {
    const grade = await createUseCase.execute({
      name: '1a',
      order: 1,
      schoolId: 'school-1',
    });

    const result = await getUseCase.execute(grade.id, 'school-1');

    expect(result.id).toBe(grade.id);
  });
});
