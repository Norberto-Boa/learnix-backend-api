import { Injectable } from '@nestjs/common';
import { EnrollmentsRepository } from '../repositories/enrollments.repository';
import type { Enrollment } from '../domain/enrollment';
import { EnrollmentNotFoundError } from '../errors/enrollment-not-found.error';

@Injectable()
export class GetEnrollmentByIdUseCase {
  constructor(private readonly enrollmentsRepository: EnrollmentsRepository) {}

  async execute(id: string, schoolId: string): Promise<Enrollment> {
    const enrollment = await this.enrollmentsRepository.findById(id, schoolId);

    if (!enrollment) {
      throw new EnrollmentNotFoundError();
    }

    return enrollment;
  }
}
