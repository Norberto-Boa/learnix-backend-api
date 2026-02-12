import { Injectable } from '@nestjs/common';
import type { StudentsRepository } from '../repositories/students.repository';
import { StudentNotFoundError } from '../errors/student-not-found.error';

interface GetStudentByIdRequest {
  studentId: string;
}

@Injectable()
export class GetStudentByIdUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute({ studentId }: GetStudentByIdRequest, schoolId: string) {
    const student = await this.studentsRepository.findById(studentId, schoolId);

    if (!student) {
      throw new StudentNotFoundError();
    }

    return student;
  }
}
