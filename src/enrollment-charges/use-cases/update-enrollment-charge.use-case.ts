import { Injectable } from '@nestjs/common';
import { EnrollmentCharge } from '../domain/enrollment-charge';
import { EnrollmentChargesRepository } from '../repositories/enrollment-charges.repository';
import { EnrollmentChargeNotFoundError } from '@/enrollment-charges/errors/enrollment-charge-not-found.error';
import { EnrollmentChargeCannotBeUpdatedError } from '@/enrollment-charges/errors/enrollment-charge-cannot-be-updated.error';
import { TotalAmountCannotBeLessThanPaidAmountError } from '@/enrollment-charges/errors/total-amount-cannot-be-less-than-paid-amount.error';
import type { DbContext } from '@/prisma/shared/db-context';

interface UpdateEnrollmentChargeUseCaseRequest {
  dueDate?: string;
  baseAmount?: number;
  penaltyAmount?: number;
}

export interface UpdateEnrollmentChargeUseCaseResponse {
  old: EnrollmentCharge;
  updated: EnrollmentCharge;
}

@Injectable()
export class UpdateEnrollmentChargeUseCase {
  constructor(
    private readonly enrollmentChargesRepository: EnrollmentChargesRepository,
  ) {}

  async execute(
    id: string,
    schoolId: string,
    {
      dueDate,
      baseAmount,
      penaltyAmount,
    }: UpdateEnrollmentChargeUseCaseRequest,
    db?: DbContext,
  ): Promise<UpdateEnrollmentChargeUseCaseResponse> {
    const enrollmentCharge = await this.enrollmentChargesRepository.findById(
      id,
      schoolId,
    );

    if (!enrollmentCharge) {
      throw new EnrollmentChargeNotFoundError();
    }

    if (enrollmentCharge.status !== 'PENDING') {
      throw new EnrollmentChargeCannotBeUpdatedError();
    }

    const updatedBaseAmount = baseAmount ?? enrollmentCharge.baseAmount;
    const updatedPenaltyAmount =
      penaltyAmount ?? enrollmentCharge.penaltyAmount;

    const totalAmount = updatedBaseAmount + updatedPenaltyAmount;

    if (totalAmount < enrollmentCharge.paidAmount) {
      throw new TotalAmountCannotBeLessThanPaidAmountError();
    }

    const balanceAmount = totalAmount - enrollmentCharge.paidAmount;

    const updatedEnrollmentCharge =
      await this.enrollmentChargesRepository.update(
        id,
        schoolId,
        {
          balanceAmount,
          ...(dueDate && { dueDate: new Date(dueDate) }),
          baseAmount: updatedBaseAmount,
          penaltyAmount: updatedPenaltyAmount,
          totalAmount,
        },
        db,
      );

    return {
      old: enrollmentCharge,
      updated: updatedEnrollmentCharge,
    };
  }
}
