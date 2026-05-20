import { Injectable } from '@nestjs/common';
import { EnrollmentCharge } from '../domain/enrollment-charge';
import { EnrollmentChargesRepository } from '../repositories/enrollment-charges.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { EnrollmentChargeAlreadyExistsError } from '@/enrollment-charges/errors/enrollment-charge-already-exists.error';

interface CreateEnrollmentChargeUseCaseRequest {
  enrollmentId: string;
  feeTypeId: string;
  academicYearId: string;

  referenceYear: number;
  referenceMonth: number;

  dueDate: Date;

  baseAmount: number;
  penaltyAmount?: number;
}

interface CreateEnrollmentChargeUseCaseResponse {
  enrollmentCharge: EnrollmentCharge;
}

@Injectable()
export class CreateEnrollmentChargeUseCase {
  constructor(
    private readonly enrollmentChargesRepository: EnrollmentChargesRepository,
  ) {}

  async execute(
    {
      enrollmentId,
      feeTypeId,
      academicYearId,
      referenceMonth,
      referenceYear,
      dueDate,
      baseAmount,
      penaltyAmount,
    }: CreateEnrollmentChargeUseCaseRequest,
    schoolId: string,
    db?: DbContext,
  ): Promise<CreateEnrollmentChargeUseCaseResponse> {
    const duplicateCharge =
      await this.enrollmentChargesRepository.findDuplicatedCharge({
        enrollmentId,
        feeTypeId,
        referenceYear,
        referenceMonth,
      });

    if (duplicateCharge) {
      throw new EnrollmentChargeAlreadyExistsError();
    }

    const totalAmount = baseAmount + (penaltyAmount ?? 0);
    const paidAmount = 0;
    const balanceAmount = totalAmount;

    const enrollmentCharge = await this.enrollmentChargesRepository.save(
      {
        enrollmentId,
        feeTypeId,
        academicYearId,
        referenceMonth,
        referenceYear,
        dueDate,
        baseAmount,
        penaltyAmount: penaltyAmount ?? 0,
        totalAmount,
        paidAmount,
        balanceAmount,
        status: 'PENDING',
      },
      schoolId,
      db,
    );

    return { enrollmentCharge };
  }
}
