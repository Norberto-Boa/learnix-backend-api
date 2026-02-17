import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students.repository';
import { StudentNotFoundError } from '../errors/student-not-found.error';
import type { DbContext } from '@/prisma/shared/db-context';

interface GetStudentByIdRequest {
  studentId: string;
}

@Injectable()
export class GetStudentByIdUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute(
    { studentId }: GetStudentByIdRequest,
    schoolId: string,
    db?: DbContext,
  ) {
    const student = await this.studentsRepository.findById(studentId, schoolId);

    if (!student) {
      throw new StudentNotFoundError();
    }

    return student;
  }
}
