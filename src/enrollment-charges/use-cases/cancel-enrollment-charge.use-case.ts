import type { EnrollmentCharge } from '@/generated/prisma/client';
import { Injectable } from '@nestjs/common';
import { EnrollmentChargesRepository } from '../repositories/enrollment-charges.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { EnrollmentNotFoundError } from '@/enrollments/errors/enrollment-not-found.error';
import { EnrollmentChargeAlreadyCancelled } from '@/enrollment-charges/errors/enrollment-charge-already-cancelled.error';
import { EnrollmentChargeWithPaymentCannotBeCancelled } from '@/enrollment-charges/errors/enrollment-charge-with-payment-cannot-be-cancelled.error';
import { EnrollmentChargeNotFoundError } from '@/enrollment-charges/errors/enrollment-charge-not-found.error';

interface CancelEnrollmentChargeUseCaseRequest {
  id: string;
}

export interface CancelEnrollmentChargeUseCaseResponse {
  enrollmentCharge: EnrollmentCharge;
}

@Injectable()
export class CancelEnrollmentChargeUseCase {
  constructor(
    private enrollmentChargesRepository: EnrollmentChargesRepository,
  ) {}

  async execute(
    { id }: CancelEnrollmentChargeUseCaseRequest,
    schoolId: string,
    db?: DbContext,
  ) {
    const enrollmentCharge = await this.enrollmentChargesRepository.findById(
      id,
      schoolId,
    );

    if (!enrollmentCharge) {
      throw new EnrollmentChargeNotFoundError();
    }

    if (enrollmentCharge.status === 'CANCELLED') {
      throw new EnrollmentChargeAlreadyCancelled();
    }

    if (
      enrollmentCharge.status === 'PAID' ||
      enrollmentCharge.status === 'PARTIALLY_PAID'
    ) {
      throw new EnrollmentChargeWithPaymentCannotBeCancelled();
    }

    const cancelledEnrollmentCharge =
      await this.enrollmentChargesRepository.cancel(id, schoolId, db);

    return {
      enrollmentCharge: cancelledEnrollmentCharge,
    };
  }
}
