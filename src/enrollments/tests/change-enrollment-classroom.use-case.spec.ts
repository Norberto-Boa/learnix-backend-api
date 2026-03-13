import { InMemoryClassroomRepository } from '@/classroom/repositories/in-memory/in-memory-classroom.repository';
import { InMemoryEnrollmentsRepository } from '../repositories/in-memory/in-memory-enrollments.repository';
import { ChangeEnrollmentClassroomUseCase } from '../use-cases/change-enrollment-classroom.use-case';
import { classroomFactory } from '@test/factories/classroom.factory';
import { enrollmentFactory } from '@test/factories/enrollment.factory';
import { ENROLLMENT_STATUS } from '@prisma/client';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found.error';
import { EnrollmentAssignedToThisClassroomError } from '../errors/enrollment-assigned-to-classroom.error';
import { EnrollmentNotActiveError } from '../errors/enrollment-not-active.error';
import { AcademicYearAndClassroomYearDoNotMatchFoundError } from '../errors/academic-year-and-classroom-year-do-not-match.error';
import { ClassroomCapacityAlreadyExceedError } from '../errors/classroom-capacity-already-exceed.error';

describe('Change Enrollment Classroom UseCase', () => {
  let enrollmentsRepository: InMemoryEnrollmentsRepository;
  let classroomsRepository: InMemoryClassroomRepository;
  let sut: ChangeEnrollmentClassroomUseCase;

  beforeEach(() => {
    enrollmentsRepository = new InMemoryEnrollmentsRepository();
    classroomsRepository = new InMemoryClassroomRepository();
    sut = new ChangeEnrollmentClassroomUseCase(
      enrollmentsRepository,
      classroomsRepository,
    );
  });

  it('Should change enrollment classroom', async () => {
    const c1 = await classroomsRepository.save(
      classroomFactory({ schoolId: 'school-1', academicYearId: '2026' }),
    );

    const c2 = await classroomsRepository.save(
      classroomFactory({ schoolId: 'school-1', academicYearId: '2026' }),
    );

    const enrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        classroomId: c1.id,
        schoolId: 'school-1',
        academicYearId: '2026',
      }),
    );

    const result = await sut.execute(
      {
        id: enrollment.id,
        classroomId: c2.id,
      },
      'school-1',
    );

    expect(result.current.classroomId).toBe(c2.id);
    expect(result.current.status).toBe(ENROLLMENT_STATUS.ACTIVE);
  });

  it('Should not change classroom for a missing enrollment', async () => {
    await expect(
      sut.execute(
        {
          id: 'non-existing-enrollment',
          classroomId: 'c1',
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(EnrollmentNotFoundError);
  });

  it('Should not change to the same classroom', async () => {
    const c1 = await classroomsRepository.save(
      classroomFactory({ schoolId: 'school-1', academicYearId: '2026' }),
    );

    const enrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        classroomId: c1.id,
        schoolId: 'school-1',
        academicYearId: '2026',
      }),
    );

    await expect(
      sut.execute(
        {
          id: enrollment.id,
          classroomId: c1.id,
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(EnrollmentAssignedToThisClassroomError);
  });

  it('Should not change classroom for cancelled enrollment', async () => {
    const enrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        classroomId: 'class-1',
        schoolId: 'school-1',
        academicYearId: '2026',
        status: ENROLLMENT_STATUS.CANCELLED,
      }),
    );

    await expect(
      sut.execute(
        {
          id: enrollment.id,
          classroomId: 'class-1',
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(EnrollmentNotActiveError);
  });

  it('Should not change to classroom from another academic year', async () => {
    const c1 = await classroomsRepository.save(
      classroomFactory({ schoolId: 'school-1', academicYearId: '2026' }),
    );

    const enrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        classroomId: 'class-1',
        schoolId: 'school-1',
        academicYearId: '2027',
      }),
    );

    await expect(
      sut.execute(
        {
          id: enrollment.id,
          classroomId: c1.id,
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(AcademicYearAndClassroomYearDoNotMatchFoundError);
  });

  it('Should not change classroom when target classroom is full', async () => {
    const c1 = await classroomsRepository.save(
      classroomFactory({
        schoolId: 'school-1',
        academicYearId: '2026',
        capacity: 1,
      }),
    );

    const c2 = await classroomsRepository.save(
      classroomFactory({
        schoolId: 'school-1',
        academicYearId: '2026',
        capacity: 0,
      }),
    );

    const enrollment = await enrollmentsRepository.save(
      enrollmentFactory({
        classroomId: c1.id,
        schoolId: 'school-1',
        academicYearId: '2026',
      }),
    );

    await expect(
      sut.execute(
        {
          id: enrollment.id,
          classroomId: c2.id,
        },
        'school-1',
      ),
    ).rejects.toBeInstanceOf(ClassroomCapacityAlreadyExceedError);
  });
});
