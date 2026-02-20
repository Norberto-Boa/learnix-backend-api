import { studentFactory } from '@test/e2e/factories/student.factory';
import { InMemoryStudentsRepository } from '../repositories/in-memory/in-memory-students.repository';
import { ActivateStudentUseCase } from '../use-cases/activate-student.use-case';
import { StudentAlreadyActiveError } from '../errors/student-already-active.error';
import { StudentNotFoundError } from '../errors/student-not-found.error';

describe('ActivateStudentUseCase', () => {
  let repository: InMemoryStudentsRepository;
  let useCase: ActivateStudentUseCase;

  beforeEach(() => {
    repository = new InMemoryStudentsRepository();
    useCase = new ActivateStudentUseCase(repository);
  });

  it('Should activate student successfully', async () => {
    const student = await repository.save(
      studentFactory({
        schoolId: '1',
      }),
    );

    repository.items[0].status = 'INACTIVE';

    const activated = await useCase.execute(student.id, '1');

    expect(activated.status).toBe('ACTIVE');
  });

  it('Should not activate student if student is already active', async () => {
    const student = await repository.save(
      studentFactory({
        schoolId: '1',
      }),
    );

    await expect(() => useCase.execute(student.id, '1')).rejects.toBeInstanceOf(
      StudentAlreadyActiveError,
    );
  });

  it('Should not activate student if student does not exist', async () => {
    await expect(() =>
      useCase.execute('non-existent-id', '1'),
    ).rejects.toBeInstanceOf(StudentNotFoundError);
  });
});
