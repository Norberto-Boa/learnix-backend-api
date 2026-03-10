import { describe, it, expect, beforeEach } from 'vitest';
import { InMemoryGradesRepository } from '../repositories/in-memory/in-memory-students.repository';
import { CreateGradeUseCase } from '../usecases/create-grade.use-case';
import { GradeAlreadyExistsError } from '../errors/grade-already-exists.error';

let repository: InMemoryGradesRepository;
let useCase: CreateGradeUseCase;

describe('CreateGradeUseCase', () => {
  beforeEach(() => {
    repository = new InMemoryGradesRepository();
    useCase = new CreateGradeUseCase(repository);
  });

  it('should create a grade', async () => {
    const grade = await useCase.execute({
      name: '1a',
      order: 1,
      schoolId: 'school-1',
    });

    expect(grade.name).toBe('1a');
    expect(repository.grades.length).toBe(1);
  });

  it('should not allow duplicate names', async () => {
    await useCase.execute({
      name: '1a',
      order: 1,
      schoolId: 'school-1',
    });

    await expect(() =>
      useCase.execute({
        name: '1a',
        order: 2,
        schoolId: 'school-1',
      }),
    ).rejects.toBeInstanceOf(GradeAlreadyExistsError);
  });
});
