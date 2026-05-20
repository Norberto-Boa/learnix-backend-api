import { Injectable } from '@nestjs/common';
import { EnrollmentCharge } from '../domain/enrollment-charge';
import { EnrollmentChargesRepository } from '@/enrollment-charges/repositories/enrollment-charges.repository';
import { EnrollmentChargeNotFoundError } from '@/enrollment-charges/errors/enrollment-charge-not-found.error';

interface GetEnrollmentChargeUseCaseRequest {
  id: string;
}

export interface GetEnrollmentChargeUseCaseResponse {
  enrollmentCharge: EnrollmentCharge;
}

@Injectable()
export class GetEnrollmentChargeUseCase {
  constructor(
    private readonly enrollmentChargesRepository: EnrollmentChargesRepository,
  ) {}

  async execute(
    { id }: GetEnrollmentChargeUseCaseRequest,
    schoolId: string,
  ): Promise<GetEnrollmentChargeUseCaseResponse> {
    const enrollmentCharge = await this.enrollmentChargesRepository.findById(
      id,
      schoolId,
    );

    if (!enrollmentCharge) {
      throw new EnrollmentChargeNotFoundError();
    }

    return {
      enrollmentCharge,
    };
  }
}
