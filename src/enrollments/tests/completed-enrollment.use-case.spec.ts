import { enrollmentFactory } from "@test/factories/enrollment.factory";
import { EnrollmentsRepository } from "../repositories/enrollments.repository"
import { InMemoryEnrollmentsRepository } from "../repositories/in-memory/in-memory-enrollments.repository";
import { CompleteEnrollmentUseCase } from "../use-cases/complete-enrollement.use-case";
import { ENROLLMENT_STATUS } from "@/generated/prisma/enums";
import { EnrollmentNotActiveError } from "../errors/enrollment-not-active.error";

describe("Complete Enrollments Use Case", () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository;
  let sut: CompleteEnrollmentUseCase;
  
  beforeEach(()=> {
    enrollmentsRepository = new InMemoryEnrollmentsRepository();
    sut = new CompleteEnrollmentUseCase(enrollmentsRepository);
  })

  it('Should complete an active enrollment', async () => {
    const enrollment = await enrollmentsRepository.save(
      enrollmentFactory({schoolId: 'school-1', status: ENROLLMENT_STATUS.ACTIVE})
    )

    const result = await sut.execute(enrollment.id, 'school-1');

    expect(result.status).toBe(ENROLLMENT_STATUS.COMPLETED);
  })

  it.skip('Should not complete a pending enrollment', async () => {
    const enrollment = await enrollmentsRepository.save(enrollmentFactory({
      schoolId: 'school',
      status: ENROLLMENT_STATUS.PENDING
    }))


    await expect (
      sut.execute(enrollment.id, 'school')
    ).rejects
  })

  it('Should not complete a transferred enrollment', async () => {
    const enrollment = await enrollmentsRepository.save(enrollmentFactory({
      schoolId: 'school',
      status: ENROLLMENT_STATUS.TRANSFERRED
    }))

    await expect(
      sut.execute(enrollment.id, 'school')
    ).rejects.toBeInstanceOf(EnrollmentNotActiveError);
  })
})