import { enrollmentFactory } from '@test/factories/enrollment.factory';
import { InMemoryEnrollmentsRepository } from '../repositories/in-memory/in-memory-enrollments.repository';
import { GetEnrollmentByIdUseCase } from '../use-cases/get-enrollment-by-id.use-case';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found.error';

describe('GetEnrollmentByIdUseCase', () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository;
  let sut: GetEnrollmentByIdUseCase;

  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentsRepository();
    sut = new GetEnrollmentByIdUseCase(enrollmentsRepository);
  });

  it('Should get an enrollment by id', async () => {
    const enrollment = await enrollmentsRepository.save(enrollmentFactory());

    const result = await sut.execute(enrollment.id, enrollment.schoolId);

    expect(result.id).toBe(enrollment.id);
  });

  it('Should throw when enrollment is not found', async () => {
    await expect(
      sut.execute('non-existent-id', 'school-id'),
    ).rejects.toBeInstanceOf(EnrollmentNotFoundError);
  });
});
