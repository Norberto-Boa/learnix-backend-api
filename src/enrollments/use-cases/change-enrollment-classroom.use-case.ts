import { Injectable } from '@nestjs/common';
import { EnrollmentsRepository } from '../repositories/enrollments.repository';
import { ClassroomRepository } from '@/classroom/repositories/classroom.repository';
import {
  ACTIVE_ENROLLMENT_STATUSES,
  type Enrollment,
} from '../domain/enrollment';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found.error';
import { EnrollmentNotActiveError } from '../errors/enrollment-not-active.error';
import { EnrollmentAssignedToThisClassroomError } from '../errors/enrollment-assigned-to-classroom.error';
import { ClassroomNotFoundError } from '@/classroom/errors/classroom-not-found.error';
import { AcademicYearAndClassroomYearDoNotMatchFoundError } from '../errors/academic-year-and-classroom-year-do-not-match.error';
import { ClassroomCapacityAlreadyExceedError } from '../errors/classroom-capacity-already-exceed.error';
import type { DbContext } from '@/prisma/shared/db-context';

interface ChangeEnrollmentClassroomRequest {
  id: string;
  classroomId: string;
}

@Injectable()
export class ChangeEnrollmentClassroomUseCase {
  constructor(
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly classroomsRepository: ClassroomRepository,
  ) {}

  async execute(
    { id, classroomId }: ChangeEnrollmentClassroomRequest,
    schoolId: string,
    db?: DbContext,
  ): Promise<{
    previous: Enrollment;
    current: Enrollment;
  }> {
    const enrollment = await this.enrollmentsRepository.findById(id, schoolId);

    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }

    if (!ACTIVE_ENROLLMENT_STATUSES.includes(enrollment.status)) {
      throw new EnrollmentNotActiveError();
    }

    if (enrollment.classroomId === classroomId) {
      throw new EnrollmentAssignedToThisClassroomError();
    }

    const targetClassroom = await this.classroomsRepository.findById(
      classroomId,
      schoolId,
    );

    if (!targetClassroom || targetClassroom.deletedAt) {
      throw new ClassroomNotFoundError();
    }

    if (targetClassroom.academicYearId !== enrollment.academicYearId) {
      throw new AcademicYearAndClassroomYearDoNotMatchFoundError();
    }

    const { count } =
      await this.enrollmentsRepository.countActiveEnrollmentsByClassroom(
        classroomId,
        schoolId,
      );

    if (count >= targetClassroom.capacity) {
      throw new ClassroomCapacityAlreadyExceedError();
    }

    const updatedEnrollment = await this.enrollmentsRepository.updateClassroom(
      id,
      schoolId,
      classroomId,
      db,
    );

    return { previous: enrollment, current: updatedEnrollment };
  }
}
