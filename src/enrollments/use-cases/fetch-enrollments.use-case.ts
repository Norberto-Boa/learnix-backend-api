import type { ENROLLMENT_STATUS } from '@/generated/prisma/enums';
import { Injectable } from '@nestjs/common';
import { EnrollmentsRepository } from '../repositories/enrollments.repository';

interface FetchEnrollmentUseCaseRequest {
  academicYearId?: string;
  classroomId?: string;
  studentId?: string;
  status?: ENROLLMENT_STATUS;
}

@Injectable()
export class FetchEnrollmentUseCase {
  constructor(private readonly enrollmentsRepository: EnrollmentsRepository) {}

  async execute(schoolId: string, params: FetchEnrollmentUseCaseRequest) {
    return await this.enrollmentsRepository.findMany(schoolId, params);
  }
}
