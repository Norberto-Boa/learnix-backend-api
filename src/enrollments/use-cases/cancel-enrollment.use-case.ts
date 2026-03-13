import { Injectable } from '@nestjs/common';
import type { EnrollmentsRepository } from '../repositories/enrollments.repository';
import type { Enrollment } from '../domain/enrollment';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found.error';
import { ENROLLMENT_STATUS } from '@/generated/prisma/enums';
import { enrollmentAlreadyCancelledError } from '../errors/enrollment-already-cancelled.error';
import { enrollmentAlreadyCompletedError } from '../errors/enrollment-already-completed.error';
import type { DbContext } from '@/prisma/shared/db-context';

@Injectable()
export class CancelEnrollmentUseCase {
  constructor(private readonly enrollmentsRepository: EnrollmentsRepository) {}

  async execute(
    id: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<Enrollment> {
    const enrollment = await this.enrollmentsRepository.findById(id, schoolId);

    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }

    if (enrollment.status === ENROLLMENT_STATUS.CANCELLED) {
      throw new enrollmentAlreadyCancelledError();
    }

    if (enrollment.status === ENROLLMENT_STATUS.COMPLETED) {
      throw new enrollmentAlreadyCompletedError();
    }

    const updateEnrollment = await this.enrollmentsRepository.updateStatus(
      id,
      schoolId,
      ENROLLMENT_STATUS.CANCELLED,
      db,
    );

    return updateEnrollment;
  }
}
