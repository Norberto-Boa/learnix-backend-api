import { enrollmentFactory } from '@test/factories/enrollment.factory';
import { EnrollmentsRepository } from '../repositories/enrollments.repository';
import { InMemoryEnrollmentsRepository } from '../repositories/in-memory/in-memory-enrollments.repository';
import { FetchEnrollmentUseCase } from '../use-cases/fetch-enrollments.use-case';
describe('Fetch Enrollments Use Case', () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository;
  let sut: FetchEnrollmentUseCase;

  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentsRepository();
    sut = new FetchEnrollmentUseCase(enrollmentsRepository);
  });

  it('Should fetch enrollments filtered by school', async () => {
    await enrollmentsRepository.save(
      enrollmentFactory({ schoolId: 'school-1' }),
    );
    await enrollmentsRepository.save(
      enrollmentFactory({ schoolId: 'school-2' }),
    );

    const result = await sut.execute('school-1', {});

    expect(result).toHaveLength(1);
  });
});
