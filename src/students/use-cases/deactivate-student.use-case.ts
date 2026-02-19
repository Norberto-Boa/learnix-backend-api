import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students.repository';
import type { StudentDomain } from '../domain/student';
import type { DbContext } from '@/prisma/shared/db-context';
import { StudentNotFoundError } from '../errors/student-not-found.error';
import { StudentAlreadyInactiveError } from '../errors/student-already-inactive.error';

@Injectable()
export class DeactivateStudentUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute(
    id: string,
    schoolId: string,
    db?: DbContext,
  ): Promise<StudentDomain> {
    const student = await this.studentsRepository.findById(id, schoolId, db);

    if (!student) {
      throw new StudentNotFoundError();
    }

    if (student.status === 'INACTIVE') {
      throw new StudentAlreadyInactiveError();
    }

    return this.studentsRepository.setStatus(id, schoolId, 'INACTIVE', db);
  }
}
