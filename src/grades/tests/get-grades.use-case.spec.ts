import { InMemoryGradesRepository } from '../repositories/in-memory/in-memory-students.repository';
import { CreateGradeUseCase } from '../usecases/create-grade.use-case';
import { GetGradesUseCase } from '../usecases/get-grades.use-case';

let repository: InMemoryGradesRepository;
let getGradesUseCase: GetGradesUseCase;
let createUseCase: CreateGradeUseCase;

describe('GetGradeUseCase', () => {
  beforeEach(() => {
    repository = new InMemoryGradesRepository();
    getGradesUseCase = new GetGradesUseCase(repository);
    createUseCase = new CreateGradeUseCase(repository);
  });

  it('Should list grades', async () => {
    await createUseCase.execute({
      name: '1a',
      order: 1,
      schoolId: 'school-1',
    });
    await createUseCase.execute({
      name: '2a',
      order: 2,
      schoolId: 'school-1',
    });

    const result = await getGradesUseCase.execute(
      {
        page: 1,
        limit: 10,
      },
      'school-1',
    );

    expect(result.total).toBe(2);
    expect(result.grades.length).toBe(2);
  });
});
