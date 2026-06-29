import { Injectable } from '@nestjs/common';
import { EnrollmentChargesRepository } from '../repositories/enrollment-charges.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { EnrollmentNotFoundError } from '@/enrollments/errors/enrollment-not-found.error';
import { OnlyPendingEnrollmentChargesCanBeDeleted } from '@/enrollment-charges/errors/only-pending-enrollment-charges-can-be-deleted.error';

interface DeleteEnrollmentChargeUseCaseRequest {
  id: string;
}

@Injectable()
export class DeleteEnrollmentChargeUseCase {
  constructor(
    private enrollmentChargesRepository: EnrollmentChargesRepository,
  ) {}

  async execute(
    { id }: DeleteEnrollmentChargeUseCaseRequest,
    schoolId: string,
    db?: DbContext,
  ): Promise<void> {
    const enrollmentCharge = await this.enrollmentChargesRepository.findById(
      id,
      schoolId,
    );

    if (!enrollmentCharge) {
      throw new EnrollmentNotFoundError();
    }

    if (enrollmentCharge.status !== 'PENDING') {
      throw new OnlyPendingEnrollmentChargesCanBeDeleted();
    }

    await this.enrollmentChargesRepository.delete(id, schoolId, db);
  }
}
