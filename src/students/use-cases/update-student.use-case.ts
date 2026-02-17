import { Injectable } from '@nestjs/common';
import type { StudentsRepository } from '../repositories/students.repository';
import type { UpdateStudentDTO } from '../dto/update-student.dto';
import type { DbContext } from '@/prisma/shared/db-context';
import { StudentNotFoundError } from '../errors/student-not-found.error';

@Injectable()
export class UpdateStudentUseCase {
  constructor(private studentsRepository: StudentsRepository) {}

  async execute(
    id: string,
    schoolId: string,
    data: UpdateStudentDTO,
    db?: DbContext,
  ) {
    const student = await this.studentsRepository.findById(id, schoolId);

    if (!student || student.deletedAt) {
      throw new StudentNotFoundError();
    }

    return this.studentsRepository.update(id, schoolId, data, db);
  }
}
