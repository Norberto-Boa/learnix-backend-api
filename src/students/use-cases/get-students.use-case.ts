import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students.repository';
import { DbContext } from '../../prisma/shared/db-context';

@Injectable()
export class GetStudentsUseCase {
  constructor(private studentsRepostory: StudentsRepository) {}

  async execute(schoolId: string, db?: DbContext) {
    return this.studentsRepostory.findMany(schoolId);
  }
}
