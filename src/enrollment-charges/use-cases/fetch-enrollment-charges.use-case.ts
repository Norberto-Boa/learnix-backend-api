import type { CHARGE_STATUS } from '@/generated/prisma/enums';
import { EnrollmentCharge } from '../domain/enrollment-charge';
import { Injectable } from '@nestjs/common';
import { EnrollmentChargesRepository } from '@/enrollment-charges/repositories/enrollment-charges.repository';

interface FetchEnrollmentChargesUseCaseRequest {
  enrollmentId?: string;
  academicYearId?: string;
  referenceYear?: number;
  referenceMonth?: number;
  status?: CHARGE_STATUS;
  page?: number;
  limit?: number;
}

export interface FetchEnrollmentChargesUseCaseResponse {
  enrollmentCharges: EnrollmentCharge[];
}

@Injectable()
export class FetchEnrollmentChargesUseCase {
  constructor(
    private readonly enrollmentChargesRepository: EnrollmentChargesRepository,
  ) {}

  async execute(
    schoolId: string,
    {
      academicYearId,
      enrollmentId,
      limit,
      page,
      referenceMonth,
      referenceYear,
      status,
    }: FetchEnrollmentChargesUseCaseRequest,
  ): Promise<FetchEnrollmentChargesUseCaseResponse> {
    const take = limit ?? 10;

    const enrollmentCharges = await this.enrollmentChargesRepository.findMany(
      schoolId,
      {
        limit: take,
        page: page ?? 1,
        academicYearId,
        enrollmentId,
        referenceMonth,
        referenceYear,
        status,
      },
    );

    return {
      enrollmentCharges,
    };
  }
}
