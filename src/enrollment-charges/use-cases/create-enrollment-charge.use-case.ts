import { Injectable } from '@nestjs/common';
import { EnrollmentCharge } from '../domain/enrollment-charge';
import { EnrollmentChargesRepository } from '../repositories/enrollment-charges.repository';
import type { DbContext } from '@/prisma/shared/db-context';
import { EnrollmentChargeAlreadyExistsError } from '@/enrollment-charges/errors/enrollment-charge-already-exists.error';
import { EnrollmentsRepository } from '../../enrollments/repositories/enrollments.repository';
import { FeeTypesRepository } from '../../fee-types/repositories/fee-types.repository';
import { AcademicYearsRepository } from '../../academic-years/repositories/academic-years.repository';
import { EnrollmentNotFoundError } from '@/enrollments/errors/enrollment-not-found.error';
import { FeeTypeNotFoundError } from '@/fee-types/errors/fee-type-not-found.error';
import { AcademicYearNotFoundError } from '@/academic-years/errors/academic-year-not-found.error';
import { EnrollmentAcademicYearDoesNotMatchAcademicYearError } from '@/enrollment-charges/errors/enrollment-academic-year-does-not-match-academic-year.error';

interface CreateEnrollmentChargeUseCaseRequest {
  enrollmentId: string;
  feeTypeId: string;
  academicYearId: string;

  referenceYear: number;
  referenceMonth: number;

  dueDate: string;

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
    private readonly enrollmentsRepository: EnrollmentsRepository,
    private readonly feeTypesRepository: FeeTypesRepository,
    private readonly academicYearsRepository: AcademicYearsRepository,
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
    const enrollment = await this.enrollmentsRepository.findById(
      enrollmentId,
      schoolId,
    );

    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }

    const feeType = await this.feeTypesRepository.findById(feeTypeId, schoolId);

    if (!feeType) {
      throw new FeeTypeNotFoundError();
    }

    const academicYear = await this.academicYearsRepository.findById(
      academicYearId,
      schoolId,
    );

    if (!academicYear) {
      throw new AcademicYearNotFoundError();
    }

    if (enrollment.academicYearId !== academicYearId) {
      throw new EnrollmentAcademicYearDoesNotMatchAcademicYearError();
    }

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
        dueDate: new Date(dueDate),
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
