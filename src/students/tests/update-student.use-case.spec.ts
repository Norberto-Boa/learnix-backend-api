import { UpdateStudentUseCase } from '../use-cases/update-student.use-case';
import { InMemoryStudentsRepository } from '../repositories/in-memory/in-memory-students.repository';
import { studentFactory } from '@test/e2e/factories/student.factory';
import { StudentNotFoundError } from '../errors/student-not-found.error';

describe('UpdantStudentUseCase', () => {
  let useCase: UpdateStudentUseCase;
  let repository: InMemoryStudentsRepository;

  beforeEach(() => {
    repository = new InMemoryStudentsRepository();
    useCase = new UpdateStudentUseCase(repository);
  });

  it('Should update student successfully', async () => {
    const student = await repository.save(
      studentFactory({
        schoolId: '1',
      }),
    );

    const updated = await useCase.execute(student.id, '1', {
      name: 'Updated Name',
    });

    expect(updated.name).toBe('Updated Name');
  });

  it('Should throw if student does not exist', async () => {
    await expect(
      useCase.execute('invalid-id', 'school-1', {
        name: 'Updated Name',
      }),
    ).rejects.instanceof(StudentNotFoundError);
  });
});
