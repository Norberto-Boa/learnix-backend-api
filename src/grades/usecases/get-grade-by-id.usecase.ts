import { Injectable } from '@nestjs/common';
import { GradesRepository } from '../repositories/grades.repository';
import { GradeNotFoundError } from '../errors/grade-not-found.error';

@Injectable()
export class GetGradeByIdUseCase {
  constructor(private gradesRepository: GradesRepository) {}

  async execute(id: string, schoolId: string) {
    const grade = await this.gradesRepository.findById(id, schoolId);

    if (!grade) {
      throw new GradeNotFoundError();
    }

    return grade;
  }
}
