import { enrollmentFactory } from '@test/factories/enrollment.factory';
import { InMemoryEnrollmentsRepository } from '../repositories/in-memory/in-memory-enrollments.repository';
import { CancelEnrollmentUseCase } from '../use-cases/cancel-enrollment.use-case';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found.error';
import { enrollmentAlreadyCancelledError } from '../errors/enrollment-already-cancelled.error';
import { enrollmentAlreadyCompletedError } from '../errors/enrollment-already-completed.error';

describe('Cancel Enrollment Use Case', () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository;
  let sut: CancelEnrollmentUseCase;

  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentsRepository();
    sut = new CancelEnrollmentUseCase(enrollmentsRepository);
  });

  it('Should cancel an enrollment', async () => {
    const enrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        status: ENROLLMENT_STATUS.ACTIVE,
      }),
    );

    const result = await sut.execute(enrollment.id, enrollment.schoolId);

    expect(result.status).toBe(ENROLLMENT_STATUS.CANCELLED);
  });

  it('Should not cancel an enrollment that does not exist', async () => {
    await expect(
      sut.execute('non-existent-id', 'existent-school'),
    ).rejects.toBeInstanceOf(EnrollmentNotFoundError);
  });

  it('Should not cancel an already cancelled enrollment', async () => {
    const enrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        status: ENROLLMENT_STATUS.ACTIVE,
      }),
    );

    await sut.execute(enrollment.id, enrollment.schoolId);

    await expect(
      sut.execute(enrollment.id, enrollment.schoolId),
    ).rejects.toBeInstanceOf(enrollmentAlreadyCancelledError);
  });

  it('Should not cancel an already completed enrollment', async () => {
    const enrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        status: ENROLLMENT_STATUS.COMPLETED,
      }),
    );

    await expect(
      sut.execute(enrollment.id, enrollment.schoolId),
    ).rejects.toBeInstanceOf(enrollmentAlreadyCompletedError);
  });
});
