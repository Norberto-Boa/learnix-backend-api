import { Injectable } from '@nestjs/common';
import { StudentsRepository } from '../repositories/students.repository';

@Injectable()
export class GetStudentsUseCase {
  constructor(private studentsRepostory: StudentsRepository) {}

  async execute(schoolId: string) {
    return this.studentsRepostory.findMany(schoolId);
  }
}
