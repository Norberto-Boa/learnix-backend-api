import { Injectable } from '@nestjs/common';
import { GradesRepository } from '../repositories/grades.repository';
import { GradeNotFoundError } from '../errors/grade-not-found.error';

@Injectable()
export class DeleteGradeUseCase {
  constructor(private gradeRepository: GradesRepository) {}

  async execute(id: string, schoolId: string) {
    const grade = await this.gradeRepository.findById(id, schoolId);

    if (!grade) {
      throw new GradeNotFoundError();
    }

    await this.gradeRepository.softDelete(id, schoolId);
  }
}
